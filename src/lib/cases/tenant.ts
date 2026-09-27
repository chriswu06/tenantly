import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { daysUntil, formatDateOnly, formatDateTime, hearingParts, icsStamp, splitAddress } from "./format";
import { requireTenantCase, type CaseRow } from "./session";

/*
 * What tenant pages show, built from the tenant's own case. Pages call
 * getTenantView(); it redirects to the start screen when there's no case.
 */

export type ChecklistItem = { id: string; label: string; tag?: "required" | "optional"; done: boolean };

const CHECKLIST: Omit<ChecklistItem, "done">[] = [
  { id: "summons", label: "Summons and complaint" },
  { id: "certification", label: "DHCD certification or request receipt", tag: "required" },
  { id: "photo-id", label: "Photo ID" },
  { id: "lease", label: "Lease agreement" },
  { id: "rent-records", label: "Rent payment records" },
  { id: "repairs", label: "Repair photos or messages", tag: "optional" },
];
export const checklistIds = CHECKLIST.map((item) => item.id);

export type TenantLicenseRecord = {
  number: string;
  status: "active" | "expired";
  validFrom: string;
  validTo: string;
  source: string;
};

export type TenantHearing = ReturnType<typeof hearingParts> & {
  daysAway: number;
  courtName: string;
  courtAddress: string;
  startUtc: string;
  endUtc: string;
};

export type TenantView = {
  id: string;
  reference: string;
  stage: CaseRow["stage"];
  caseNumber: string;
  landlordName: string;
  court: string;
  propertyAddress: string;
  street: string;
  cityLine: string;
  filingDate: string;
  filingDateIso: string | null;
  hearing: TenantHearing | null;
  licenseResult: CaseRow["license_result"];
  checkedAt: string | null;
  records: TenantLicenseRecord[];
  checklist: ChecklistItem[];
  certificationRequestedAt: string | null;
  sharedWith: { slug: string; name: string } | null;
  tenantFirstName: string | null;
  tenantPhone: string | null;
  outcome: CaseRow["outcome"];
  row: CaseRow;
};

export function toHearing(row: Pick<CaseRow, "hearing_at" | "court">): TenantHearing | null {
  if (!row.hearing_at) return null;
  const court = row.court || "District Court, 501 E Fayette St";
  return {
    ...hearingParts(row.hearing_at),
    daysAway: daysUntil(row.hearing_at),
    courtName: court,
    courtAddress: court.replace(/^District Court,\s*/, ""),
    startUtc: icsStamp(row.hearing_at),
    endUtc: icsStamp(new Date(new Date(row.hearing_at).getTime() + 3 * 3_600_000).toISOString()),
  };
}

/** The tenant's case, shaped for display. Cached per request. */
export const getTenantView = cache(async (): Promise<TenantView> => {
  const row = await requireTenantCase();
  const admin = createAdminClient();
  const [records, lastCheck, org] = await Promise.all([
    admin.from("license_records").select("*").eq("case_id", row.id).order("valid_to", { ascending: false }),
    admin.from("license_checks").select("checked_at").eq("case_id", row.id).order("checked_at", { ascending: false }).limit(1).maybeSingle(),
    row.organization_id
      ? admin.from("organizations").select("slug, name").eq("id", row.organization_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const done = (row.checklist ?? {}) as Record<string, boolean>;
  const { street, cityLine } = splitAddress(row.property_address);

  return {
    id: row.id,
    reference: row.reference,
    stage: row.stage,
    caseNumber: row.case_number ?? "",
    landlordName: row.landlord_name ?? "",
    court: row.court ?? "",
    propertyAddress: row.property_address ?? "",
    street,
    cityLine,
    filingDate: formatDateOnly(row.filing_date),
    filingDateIso: row.filing_date,
    hearing: toHearing(row),
    licenseResult: row.license_result,
    checkedAt: lastCheck.data ? formatDateTime(lastCheck.data.checked_at) : null,
    records: (records.data ?? []).map((r) => ({
      number: r.license_number,
      status: r.status as "active" | "expired",
      validFrom: formatDateOnly(r.valid_from),
      validTo: formatDateOnly(r.valid_to),
      source: r.source,
    })),
    checklist: CHECKLIST.map((item) => ({
      ...item,
      // The summons is in hand by definition; certification counts once it's been requested.
      done: done[item.id] ?? (item.id === "summons" || (item.id === "certification" && Boolean(row.certification_requested_at))),
    })),
    certificationRequestedAt: row.certification_requested_at,
    sharedWith: org.data ?? null,
    tenantFirstName: row.tenant_first_name,
    tenantPhone: row.tenant_phone,
    outcome: row.outcome,
    row,
  };
});

/** Legal aid organizations accepting referrals, for the share screen. */
export async function listReferralOrganizations() {
  const { data } = await createAdminClient()
    .from("organizations")
    .select("id, slug, name, short_description, description")
    .eq("accepts_referrals", true)
    .order("name");
  return data ?? [];
}

/** Adds a line to the case's activity timeline. */
export async function addCaseEvent(caseId: string, actor: string, title: string, advocateId?: string) {
  await createAdminClient().from("case_events").insert({ case_id: caseId, actor, title, advocate_id: advocateId ?? null });
}

// Display helpers for tenant pages and PDFs

/** Where tenants request the official license certification. */
export const dhcdOffice = {
  name: "Property Registration & Licensing Division",
  address: "417 E Fayette St, Room 100",
  fullAddress: "417 E Fayette St, Room 100, Baltimore, MD",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=417+E+Fayette+St+Baltimore+MD+21202",
};

/**
 * What to type into the city's license lookup: street number and name only,
 * uppercase, without the unit (the lookup finds nothing with one).
 * "2417 E Monument St, Apt 2, Baltimore, …" → "2417 E MONUMENT ST".
 */
export function lookupAddressOf(view: Pick<TenantView, "row" | "street">) {
  const first = (view.row.normalized_address ?? view.street).split(",")[0] ?? "";
  return first
    .replace(/\s+(apt|apartment|unit|ste|suite|fl|floor|rm|room)\b.*$/i, "")
    .replace(/\s+#.*$/, "")
    .trim()
    .toUpperCase();
}

/** The normalized address as the verify screens show it, e.g. "2417 E MONUMENT ST, BALTIMORE, MARYLAND, 21205". */
export function normalizedAddressOf(row: CaseRow) {
  return (row.normalized_address ?? row.property_address ?? "").toUpperCase();
}

/** A data: URL for an .ics file of the hearing, for "Add to calendar". */
export function hearingIcsHref(view: Pick<TenantView, "hearing" | "reference" | "caseNumber">) {
  const { hearing } = view;
  if (!hearing) return null;
  const escape = (text: string) => text.replace(/([,;\\])/g, "\\$1");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Standing//EN",
    "BEGIN:VEVENT",
    `UID:${view.reference}@standing`,
    `DTSTAMP:${icsStamp(new Date().toISOString())}`,
    `DTSTART:${hearing.startUtc}`,
    `DTEND:${hearing.endUtc}`,
    "SUMMARY:Rent court hearing",
    `LOCATION:${escape(`${hearing.courtName}, Baltimore, MD`)}`,
    `DESCRIPTION:${escape(`Case ${view.caseNumber}. ${hearing.arrive.replace(/^Arrive/, "Arrive by")}.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/** Results that don’t settle the license question yet: the tenant still needs the guided check. */
export function isUnverified(result: CaseRow["license_result"]) {
  return result === "pending" || result === "could_not_verify" || result === "needs_review";
}

/** "Hearing in 17 days", "Hearing tomorrow", "Hearing today". Pass another noun for e.g. "Court date in 17 days". */
export function hearingInDays(days: number, noun = "Hearing") {
  return days === 0 ? `${noun} today` : days === 1 ? `${noun} tomorrow` : `${noun} in ${days} days`;
}

export type ResultCopy = {
  tone: "ok" | "warn" | "danger";
  badge: string;
  title: string;
  /** Full sentence(s), for mobile and the PDF. */
  text: string;
  /** Shorter desktop version (the records table sits next to it). */
  short: string;
};

/** How each license result reads to the tenant. "ok" is the tenant-favourable outcome. */
export function licenseResultCopy(view: Pick<TenantView, "licenseResult" | "filingDate" | "records">): ResultCopy {
  const filed = view.filingDate ? `the filing date (${view.filingDate})` : "the filing date";
  const lastExpiry = view.records.find((r) => r.status === "expired")?.validTo;
  const mayNot = "The landlord may not be permitted to pursue this case.";
  const checkYourself = "Check the city’s license lookup yourself. It takes about 2 minutes.";
  switch (view.licenseResult) {
    case "no_license":
      return {
        tone: "ok",
        badge: "Possible defense",
        title: "No active rental license found",
        text: `DHCD records show no active license for this address on ${filed}. ${mayNot}`,
        short: `DHCD records show no active license on the filing date. ${mayNot}`,
      };
    case "expired":
      return {
        tone: "ok",
        badge: "Possible defense",
        title: "The rental license had expired",
        text: `No license was active for this address on ${filed}.${lastExpiry ? ` The last license expired ${lastExpiry}.` : ""} ${mayNot}`,
        short: `No license was active on the filing date.${lastExpiry ? ` The last one expired ${lastExpiry}.` : ""} ${mayNot}`,
      };
    case "active":
      return {
        tone: "warn",
        badge: "License found",
        title: "An active license was found",
        text: `DHCD records show an active rental license for this address on ${filed}. The license defense likely doesn’t apply, but a lawyer can check for other defenses.`,
        short: "DHCD records show an active license on the filing date. The license defense likely doesn’t apply, but a lawyer can check for other defenses.",
      };
    case "needs_review":
      return {
        tone: "warn",
        badge: "Needs review",
        title: "The license records need a closer look",
        text: `The city’s records for this address don’t agree. ${checkYourself}`,
        short: `The city’s records for this address don’t agree. ${checkYourself}`,
      };
    case "could_not_verify":
      return {
        tone: "danger",
        badge: "Verification incomplete",
        title: "We couldn’t verify the rental license yet",
        text: `This is not a negative result. ${checkYourself}`,
        short: `This is not a negative result. ${checkYourself}`,
      };
    default:
      return {
        tone: "warn",
        badge: "Not checked yet",
        title: "The license hasn’t been checked yet",
        text: `${checkYourself} Then we’ll show your next steps.`,
        short: `${checkYourself} Then we’ll show your next steps.`,
      };
  }
}
