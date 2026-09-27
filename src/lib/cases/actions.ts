"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { jurisdictionAt } from "@/lib/arcgis/baltimore-boundary";
import { geocodeAddress } from "@/lib/arcgis/geocode";
import { extractSummons, type ExtractedFieldName } from "@/lib/gemini/extract-summons";
import { licenseProvider } from "@/lib/license/verify";
import { allow, clientKey } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { fieldErrorsOf, type FormState } from "@/lib/validation/schemas";
import { fromDateTimeInput } from "./format";
import { clearTenantCase, createTenantCase, getTenantCase, requireTenantCase } from "./session";
import { addCaseEvent, checklistIds } from "./tenant";

/*
 * Server Actions for the tenant flow. Every action works on the case in the
 * tenant's cookie (requireTenantCase), never on an id sent by the browser.
 */

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const UPLOAD_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp", "application/pdf"];
const BUCKET = "summons";

/* 1. Start ---------------------------------------------------------------------- */

/** Upload or camera capture: `summons` is the file. Then reading starts on /scan/extracting. */
export async function startWithUpload(formData: FormData) {
  const file = formData.get("summons");
  if (!(file instanceof File) || file.size === 0) redirect("/scan/upload-failed?reason=missing");
  if (file.size > MAX_UPLOAD_BYTES) redirect("/scan/upload-failed?reason=size");
  if (!UPLOAD_TYPES.includes(file.type)) redirect("/scan/upload-failed?reason=type");
  if (!allow(await clientKey("upload"), 10, 60 * 60_000)) redirect("/scan/upload-failed?reason=busy");

  const existing = await getTenantCase();
  const row = existing && existing.stage === "needs_review" ? existing : await createTenantCase();
  const path = `${row.id}/${randomUUID()}`;
  const { error } = await createAdminClient()
    .storage.from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) redirect("/scan/upload-failed?reason=storage");

  await createAdminClient().from("cases").update({ summons_path: path }).eq("id", row.id);
  if (!existing) await addCaseEvent(row.id, "Tenant", "Case created from tenant scan");
  redirect("/scan/extracting");
}

/** "Enter details manually": a case with no summons, straight to the review form. */
export async function startManually() {
  const existing = await getTenantCase();
  if (!existing || existing.stage === "closed") {
    const row = await createTenantCase();
    await addCaseEvent(row.id, "Tenant", "Case created from manual entry");
  }
  redirect("/scan/review");
}

/** "Start over": forget this browser's case. */
export async function startOver() {
  await clearTenantCase();
  redirect("/");
}

/* 2. Read the summons ------------------------------------------------------------ */

export type ExtractionResult =
  | { status: "done"; next: "/scan/review" }
  | { status: "unreadable"; next: "/scan/unreadable" }
  | { status: "unavailable"; next: "/scan/review" };

const FIELD_COLUMNS: Record<ExtractedFieldName, string> = {
  propertyAddress: "property_address",
  caseNumber: "case_number",
  landlordName: "landlord_name",
  court: "court",
  filingDate: "filing_date",
  hearingDate: "hearing_at",
  licenseNumberOnComplaint: "license_number_on_complaint",
};

/**
 * Reads the uploaded summons with Gemini, pre-fills the case, and deletes the
 * file. Called by /scan/extracting once it has rendered.
 */
export async function readSummons(): Promise<ExtractionResult> {
  const row = await requireTenantCase();
  const admin = createAdminClient();
  if (!row.summons_path) return { status: "done", next: "/scan/review" };

  const deleteFile = async () => {
    await admin.storage.from(BUCKET).remove([row.summons_path!]);
    await admin.from("cases").update({ summons_path: null }).eq("id", row.id);
  };

  if (!allow(await clientKey("extract"), 10, 60 * 60_000)) {
    await deleteFile();
    return { status: "unavailable", next: "/scan/review" };
  }

  const { data: blob, error } = await admin.storage.from(BUCKET).download(row.summons_path);
  if (error || !blob) {
    await deleteFile();
    return { status: "unavailable", next: "/scan/review" };
  }

  try {
    const result = await extractSummons({ data: await blob.arrayBuffer(), mimeType: blob.type || "image/jpeg" });
    await deleteFile();
    if (!result.isSummons || !result.readable) {
      await addCaseEvent(row.id, "System", "Summons couldn’t be read");
      return { status: "unreadable", next: "/scan/unreadable" };
    }

    const update: Record<string, string | null> = {};
    const extracted: Record<string, { value: string | null; confidence: string }> = {};
    let found = 0;
    for (const [name, column] of Object.entries(FIELD_COLUMNS) as [ExtractedFieldName, string][]) {
      const fieldValue = result[name];
      extracted[name] = fieldValue;
      if (fieldValue.value) {
        update[column] = fieldValue.value;
        found += 1;
      }
    }
    await admin.from("cases").update({ ...update, extracted }).eq("id", row.id);
    await addCaseEvent(row.id, "System", `Summons fields extracted (${found}/7)`);
    return { status: "done", next: "/scan/review" };
  } catch (err) {
    console.error("Summons extraction failed", err);
    await deleteFile();
    await addCaseEvent(row.id, "System", "Automatic reading unavailable; details entered manually");
    return { status: "unavailable", next: "/scan/review" };
  }
}

/* 3. Confirm details and check the address ---------------------------------------- */

const detailsSchema = z.object({
  propertyAddress: z.string().trim().min(8, "Enter the full property address, including the street number."),
  caseNumber: z.string().trim().min(4, "Enter the case number from the top of your summons."),
  landlordName: z.string().trim().min(2, "Enter the landlord or company named on the summons."),
  filingDate: z.iso.date("Enter the date the complaint was filed."),
  hearingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Enter your court date and time."),
  licenseNumberOnComplaint: z.string().trim().max(40).optional(),
});

export async function confirmDetails(_prev: FormState, formData: FormData): Promise<FormState> {
  const row = await requireTenantCase();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = detailsSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values: raw };
  const d = parsed.data;

  const admin = createAdminClient();
  await admin
    .from("cases")
    .update({
      property_address: d.propertyAddress,
      case_number: d.caseNumber,
      landlord_name: d.landlordName,
      filing_date: d.filingDate,
      hearing_at: fromDateTimeInput(d.hearingDate),
      license_number_on_complaint: d.licenseNumberOnComplaint || null,
    })
    .eq("id", row.id);

  let match;
  try {
    match = await geocodeAddress(d.propertyAddress);
  } catch (err) {
    console.error("Geocoding failed", err);
    return { error: "We couldn’t check the address just now. Try again in a moment.", values: raw };
  }
  if (!match) {
    return {
      fieldErrors: { propertyAddress: ["We couldn’t find this address. Check the street number and name."] },
      values: raw,
    };
  }

  const jurisdiction = await jurisdictionAt(match.latitude, match.longitude).catch(() => match.subregion);
  const inCity = jurisdiction === "Baltimore City";
  await admin
    .from("cases")
    .update({
      normalized_address: match.address,
      latitude: match.latitude,
      longitude: match.longitude,
      jurisdiction,
      in_baltimore_city: inCity,
      stage: inCity ? "verifying" : "needs_review",
    })
    .eq("id", row.id);
  await addCaseEvent(row.id, "Tenant", "Summons details confirmed");

  redirect(inCity ? "/verify" : "/scan/outside-area");
}

/* 4. License check ------------------------------------------------------------------ */

/** Runs the license lookup. Called by /verify once it has rendered; returns where to go next. */
export async function runLicenseCheck(): Promise<{ next: string }> {
  const row = await requireTenantCase();
  if (!row.in_baltimore_city || !row.normalized_address) return { next: "/scan/review" };
  const admin = createAdminClient();

  const lookup = await licenseProvider.lookup({ normalized: row.normalized_address, filingDate: row.filing_date });
  if (lookup.status === "unavailable") {
    await admin.from("license_checks").insert({
      case_id: row.id,
      method: "automatic",
      result: "could_not_verify",
      source: "Baltimore City DHCD",
      lookup_address: row.normalized_address,
      error: lookup.reason,
    });
    await admin.from("cases").update({ license_result: "could_not_verify" }).eq("id", row.id);
    await addCaseEvent(row.id, "System", "DHCD lookup unavailable; guided check started");
    return { next: "/verify/guided-check" };
  }

  await admin.from("license_records").delete().eq("case_id", row.id);
  if (lookup.records.length) {
    await admin.from("license_records").insert(
      lookup.records.map((r) => ({
        case_id: row.id,
        license_number: r.licenseNumber,
        status: r.status,
        valid_from: r.validFrom,
        valid_to: r.validTo,
        source: r.source,
      })),
    );
  }
  await admin.from("license_checks").insert({
    case_id: row.id,
    method: "automatic",
    result: lookup.result,
    source: lookup.source,
    lookup_address: row.normalized_address,
    response_ms: lookup.responseMs,
  });
  await admin.from("cases").update({ license_result: lookup.result, stage: "needs_certification" }).eq("id", row.id);
  await addCaseEvent(row.id, "System", `DHCD lookup: ${lookup.result === "active" ? "active license" : "no active license"}`);
  return { next: "/results" };
}

const guidedSchema = z.object({ finding: z.enum(["none", "expired", "active"], "Choose what the city lookup shows.") });
const guidedResult = { none: "no_license", expired: "expired", active: "active" } as const;
const guidedLabel = { none: "no license shows up", expired: "license expired", active: "license active" } as const;

/** The tenant reports what the city's lookup showed (guided check). */
export async function submitGuidedCheck(_prev: FormState, formData: FormData): Promise<FormState> {
  const row = await requireTenantCase();
  const parsed = guidedSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const result = guidedResult[parsed.data.finding];
  const admin = createAdminClient();
  await admin.from("license_checks").insert({
    case_id: row.id,
    method: "guided",
    result,
    source: "Tenant guided check",
    lookup_address: row.normalized_address,
  });
  await admin.from("cases").update({ license_result: result, stage: "needs_certification" }).eq("id", row.id);
  await addCaseEvent(row.id, "Tenant", `Guided check: ${guidedLabel[parsed.data.finding]}`);
  redirect("/results");
}

/* 5. Next steps ---------------------------------------------------------------------- */

export async function markCertificationRequested() {
  const row = await requireTenantCase();
  if (!row.certification_requested_at) {
    await createAdminClient()
      .from("cases")
      .update({ certification_requested_at: new Date().toISOString(), stage: "ready_for_court" })
      .eq("id", row.id);
    await addCaseEvent(row.id, "Tenant", "DHCD certification requested");
  }
  redirect("/court-prep");
}

/** Ticks or unticks a court-prep checklist item. */
export async function setChecklistItem(id: string, done: boolean) {
  if (!checklistIds.includes(id)) return;
  const row = await requireTenantCase();
  const checklist = { ...((row.checklist ?? {}) as Record<string, boolean>), [id]: done };
  await createAdminClient().from("cases").update({ checklist }).eq("id", row.id);
  revalidatePath("/court-prep");
}

/* 6. Share with legal aid --------------------------------------------------------------- */

const shareSchema = z.object({
  org: z.string().min(1, "Choose an organization."),
  firstName: z.string().trim().min(1, "Enter your first name.").max(60),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().regex(/^1?\d{10}$/, "Enter a 10-digit phone number.")),
  language: z.string().trim().max(40).optional(),
  consent: z.literal("on", "Check the box to agree to share your case."),
});

export async function shareCase(_prev: FormState, formData: FormData): Promise<FormState> {
  const row = await requireTenantCase();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = shareSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values: raw };

  const admin = createAdminClient();
  const { data: org } = await admin
    .from("organizations")
    .select("id, name")
    .eq("slug", parsed.data.org)
    .eq("accepts_referrals", true)
    .maybeSingle();
  if (!org) return { fieldErrors: { org: ["Choose an organization."] }, values: raw };

  const digits = parsed.data.phone.slice(-10);
  await admin
    .from("cases")
    .update({
      organization_id: org.id,
      tenant_first_name: parsed.data.firstName,
      tenant_phone: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`,
      tenant_language: parsed.data.language || null,
      shared_at: new Date().toISOString(),
    })
    .eq("id", row.id);
  await addCaseEvent(row.id, "Tenant", `Tenant shared case with ${org.name}`);
  redirect(`/share/confirmation?org=${encodeURIComponent(parsed.data.org)}`);
}

export async function withdrawShare() {
  const row = await requireTenantCase();
  await createAdminClient()
    .from("cases")
    .update({ organization_id: null, assignee_id: null, shared_at: null })
    .eq("id", row.id);
  await addCaseEvent(row.id, "Tenant", "Tenant withdrew sharing");
  redirect("/share");
}

/* 7. Outcome ------------------------------------------------------------------------------- */

const outcomeSchema = z.object({
  outcome: z.enum(
    ["raised_license_defense", "case_dismissed", "case_postponed", "did_not_raise_defense", "did_not_attend"],
    "Choose what happened at your hearing.",
  ),
});

/**
 * Anonymous outcome report. Stored on its own, with no link to the case or the
 * organization and only the day it was sent, as the outcome page promises.
 */
export async function reportOutcome(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = outcomeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };
  if (!allow(await clientKey("outcome"), 5, 60 * 60_000)) return { ok: true };

  await createAdminClient().from("outcome_reports").insert({ outcome: parsed.data.outcome });
  return { ok: true };
}
