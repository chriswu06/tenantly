// Shared by scripts/invite.mjs and scripts/org.mjs: creates an advocate invitation,
// prints its sign-up link and emails it when SMTP_USER/SMTP_PASSWORD are set.
import { createClient } from "@supabase/supabase-js";
import { emailConfigured, sendInviteEmail } from "../../src/lib/email/invite-email.ts";

export const LIVE_SITE = "https://tenantly-blush.vercel.app";

export function adminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false },
  });
}

/** Exits the process with a message if the invitation can't be created. */
export async function inviteAdvocate(supabase, { org, email, role = "staff_attorney", admin = false, site = LIVE_SITE }) {
  const { data: invite, error } = await supabase
    .from("invitations")
    .insert({ organization_id: org.id, email: email.toLowerCase(), role, is_admin: admin })
    .select("token, expires_at")
    .single();
  if (error) {
    console.error("Couldn’t create the invitation:", error.message);
    process.exit(1);
  }
  const link = `${site.replace(/\/$/, "")}/advocate/sign-up?invite=${invite.token}`;
  console.log(`Invitation for ${email} to ${org.name}${admin ? " (admin)" : ""}, expires ${invite.expires_at.slice(0, 10)}:`);
  console.log(link);
  if (!emailConfigured()) {
    console.log("Not emailed: SMTP_USER and SMTP_PASSWORD aren’t set. Send them the link yourself.");
  } else if (await sendInviteEmail({ to: email, link, organization: org.name, isAdmin: admin })) {
    console.log(`Emailed to ${email}.`);
  } else {
    console.log("The email didn’t send (see the error above). Send them the link yourself.");
  }
}
