// Creates an advocate invitation and prints its sign-up link.
// Usage: npm run invite -- --org pjc --email you@example.org [--role staff_attorney] [--admin]
// Use this for the first advocate of an organization; after that, admins invite from the Team page.
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    org: { type: "string" },
    email: { type: "string" },
    role: { type: "string", default: "staff_attorney" },
    admin: { type: "boolean", default: false },
  },
});
if (!values.org || !values.email) {
  console.error("Usage: npm run invite -- --org <pjc|mla|mvls> --email <address> [--role <role>] [--admin]");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
const { data: org, error: orgError } = await supabase.from("organizations").select("id, name").eq("slug", values.org).single();
if (orgError) {
  console.error(`No organization with slug "${values.org}".`);
  process.exit(1);
}
const { data: invite, error } = await supabase
  .from("invitations")
  .insert({ organization_id: org.id, email: values.email.toLowerCase(), role: values.role, is_admin: values.admin })
  .select("token, expires_at")
  .single();
if (error) {
  console.error("Couldn’t create the invitation:", error.message);
  process.exit(1);
}
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
console.log(`Invitation for ${values.email} to ${org.name}${values.admin ? " (admin)" : ""}, expires ${invite.expires_at.slice(0, 10)}:`);
console.log(`${site}/advocate/sign-up?invite=${invite.token}`);
