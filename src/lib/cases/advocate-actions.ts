"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdvocate } from "@/lib/auth";
import { sendInviteEmail } from "@/lib/email/invite-email";
import { licenseProvider } from "@/lib/license/verify";
import { siteUrl } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { advocateRoles, fieldErrorsOf, inviteSchema, type FormState } from "@/lib/validation/schemas";

/*
 * Server Actions for the advocate console. Each runs as the signed-in advocate,
 * so row-level security confines writes to their organization's cases.
 */

async function caseByReference(reference: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select("id, normalized_address, filing_date").eq("reference", reference).maybeSingle();
  if (!data) throw new Error("Case not found");
  return { supabase, row: data };
}

async function logEvent(caseId: string, title: string) {
  const me = await requireAdvocate();
  const supabase = await createClient();
  await supabase.from("case_events").insert({ case_id: caseId, actor: me.fullName, advocate_id: me.id, title });
}

/** "Record certification": the DHCD certification is in hand. */
export async function recordCertification(reference: string) {
  await requireAdvocate();
  const { supabase, row } = await caseByReference(reference);
  const now = new Date().toISOString();
  await supabase
    .from("cases")
    .update({ certification_received_at: now, certification_requested_at: now, stage: "ready_for_court" })
    .eq("id", row.id);
  await logEvent(row.id, "DHCD certification recorded");
  revalidatePath(`/advocate/cases/${reference}`, "layout");
  revalidatePath("/advocate", "layout");
}

/** "Re-run": try the automatic license lookup again. */
export async function rerunLookup(reference: string) {
  await requireAdvocate();
  const { row } = await caseByReference(reference);
  if (!row.normalized_address) return;
  const lookup = await licenseProvider.lookup({ normalized: row.normalized_address, filingDate: row.filing_date });
  await logEvent(
    row.id,
    lookup.status === "unavailable" ? "Lookup re-run: DHCD records unavailable" : `Lookup re-run: ${lookup.result.replace("_", " ")}`,
  );
  revalidatePath(`/advocate/cases/${reference}`, "layout");
}

/** "Assign": take the case. */
export async function assignToMe(reference: string) {
  const me = await requireAdvocate();
  const { supabase, row } = await caseByReference(reference);
  await supabase.from("cases").update({ assignee_id: me.id }).eq("id", row.id);
  await logEvent(row.id, `Assigned to ${me.fullName}`);
  revalidatePath("/advocate", "layout");
}

/** Team page: invite a teammate. Returns the sign-up link to share with them. */
export async function inviteMember(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdvocate();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  if (!me.isAdmin) return { error: "Only administrators can invite teammates.", values: raw };
  const parsed = inviteSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values: raw };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      organization_id: me.organization.id,
      email: parsed.data.email,
      role: parsed.data.role,
      is_admin: parsed.data.admin === "on",
      invited_by: me.id,
    })
    .select("token")
    .single();
  if (error || !data) {
    const duplicate = error?.code === "23505";
    return { error: duplicate ? "That email already has an open invitation." : "We couldn’t create the invitation. Try again.", values: raw };
  }
  revalidatePath("/advocate/team");
  const link = `${await siteUrl()}/advocate/sign-up?invite=${data.token}`;
  const sent = await sendInviteEmail({
    to: parsed.data.email,
    link,
    organization: me.organization.name,
    inviter: me.fullName,
    isAdmin: parsed.data.admin === "on",
  });
  return { ok: true, values: { link, email: parsed.data.email, sent: sent ? "yes" : "" } };
}

export async function withdrawInvitation(id: string) {
  await requireAdvocate();
  const supabase = await createClient();
  await supabase.from("invitations").delete().eq("id", id);
  revalidatePath("/advocate/team");
}

const settingsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  role: z.enum(advocateRoles, "Choose your role."),
  notifyShared: z.literal("on").optional(),
  notifyHearing: z.literal("on").optional(),
  notifyLookup: z.literal("on").optional(),
});

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep it under ${max} characters.`)
    .transform((v) => v || null);

/** The organization fields an admin can edit. Shown to tenants on the share screen. */
const organizationSchema = z.object({
  orgName: z.string().trim().min(2, "Enter your organization’s name.").max(120),
  orgDescription: optionalText(80),
  callback: z
    .string()
    .trim()
    .refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number.")
    .transform((v) => v || null),
  acceptsReferrals: z.literal("on").optional(),
});

export async function updateSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdvocate();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = settingsSchema.safeParse(raw);
  // Only admins' forms carry the organization fields, and only admins may save them.
  const org = me.isAdmin && "orgName" in raw ? organizationSchema.safeParse(raw) : undefined;
  if (!parsed.success || (org && !org.success)) {
    return {
      fieldErrors: {
        ...(parsed.success ? {} : fieldErrorsOf(parsed.error)),
        ...(org && !org.success ? fieldErrorsOf(org.error) : {}),
      },
      values: raw,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("advocates")
    .update({
      full_name: parsed.data.fullName,
      role: parsed.data.role,
      notify_shared: parsed.data.notifyShared === "on",
      notify_hearing: parsed.data.notifyHearing === "on",
      notify_lookup: parsed.data.notifyLookup === "on",
    })
    .eq("id", me.id);
  if (error) return { error: "We couldn’t save your settings. Try again.", values: raw };

  if (org?.success) {
    // Advocates can't write organizations under row-level security, so this goes
    // through the admin client, limited to the admin's own organization.
    const { error: orgError } = await createAdminClient()
      .from("organizations")
      .update({
        name: org.data.orgName,
        description: org.data.orgDescription,
        short_description: org.data.orgDescription,
        callback_phone: org.data.callback,
        accepts_referrals: org.data.acceptsReferrals === "on",
      })
      .eq("id", me.organization.id);
    if (orgError) return { error: "We couldn’t save your organization’s details. Try again.", values: raw };
  }
  revalidatePath("/advocate", "layout");
  return { ok: true };
}
