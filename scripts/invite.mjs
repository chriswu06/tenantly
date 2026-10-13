// Invites an advocate to an existing organization: emails the sign-up link and prints it.
// Usage: npm run invite -- --org pjc --email you@example.org [--role staff_attorney] [--admin] [--site <url>]
// For a new organization, use npm run org instead. After the first admin signs up,
// they invite the rest of their team from the Team page.
import { parseArgs } from "node:util";
import { adminClient, inviteAdvocate, LIVE_SITE } from "./lib/invitation.mjs";

const { values } = parseArgs({
  options: {
    org: { type: "string" },
    email: { type: "string" },
    role: { type: "string", default: "staff_attorney" },
    admin: { type: "boolean", default: false },
    site: { type: "string", default: LIVE_SITE },
  },
});
if (!values.org || !values.email) {
  console.error("Usage: npm run invite -- --org <slug> --email <address> [--role <role>] [--admin] [--site <url>]");
  process.exit(1);
}

const supabase = adminClient();
const { data: org } = await supabase.from("organizations").select("id, name").eq("slug", values.org).maybeSingle();
if (!org) {
  console.error(`No organization with slug "${values.org}". Create it with npm run org.`);
  process.exit(1);
}
await inviteAdvocate(supabase, { org, ...values });
