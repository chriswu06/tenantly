"use server";

import { redirect } from "next/navigation";
import { siteUrl } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  fieldErrorsOf,
  newPasswordSchema,
  resetRequestSchema,
  signInSchema,
  signUpSchema,
  type FormState,
} from "@/lib/validation/schemas";

/** Only same-site paths inside the console; anything else falls back to the overview. */
function safeNext(next: string | undefined) {
  return next && next.startsWith("/advocate") && !next.startsWith("//") ? next : "/advocate";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { error: "That email and password don’t match an account. Check them and try again.", values };
  }
  redirect(safeNext(parsed.data.next));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { name: String(formData.get("name") ?? ""), role: String(formData.get("role") ?? "") };
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const admin = createAdminClient();
  const { data: invite } = await admin
    .from("invitations")
    .select("id, organization_id, email, is_admin, accepted_at, expires_at")
    .eq("token", parsed.data.invite)
    .maybeSingle();
  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    return { error: "This invitation is no longer valid. Ask your organization to send a new one.", values };
  }

  // The invitation link went to this address, so we treat the email as confirmed.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.name },
  });
  if (createError || !created.user) {
    const exists = createError?.message.toLowerCase().includes("already");
    return {
      error: exists
        ? "An account with this email already exists. Sign in instead."
        : "We couldn’t create your account. Try again in a moment.",
      values,
    };
  }

  const { error: profileError } = await admin.from("advocates").insert({
    id: created.user.id,
    organization_id: invite.organization_id,
    full_name: parsed.data.name,
    email: invite.email,
    role: parsed.data.role,
    is_admin: invite.is_admin,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: "We couldn’t finish setting up your account. Try again in a moment.", values };
  }
  await admin.from("invitations").update({ accepted_at: new Date().toISOString() }).eq("id", invite.id);

  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email: invite.email, password: parsed.data.password });
  redirect("/advocate");
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = resetRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const supabase = await createClient();
  // Same response whether or not the account exists, so the form can't be used to probe emails.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${await siteUrl()}/auth/callback?next=/advocate/reset-password/update`,
  });
  redirect(`/advocate/reset-password/sent?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: "This reset link has expired. Request a new one from the sign-in page." };
  }
  redirect("/advocate");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/advocate/sign-in");
}
