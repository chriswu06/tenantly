// Adds a legal aid organization and invites its first administrator, who can then
// fill in its details under Settings and invite their team from the Team page.
// Usage: npm run org -- --name "Homeless Persons Representation Project" --admin-email lead@hprp.org
//          [--slug hprp] [--description "Tenant advocacy · Responds by phone"] [--phone 410-555-0100]
//          [--hidden] [--site <url>]
// --hidden keeps it off the tenant share screen until the admin turns on "Accepting cases from tenants".
import { parseArgs } from "node:util";
import { adminClient, inviteAdvocate, LIVE_SITE } from "./lib/invitation.mjs";

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    "admin-email": { type: "string" },
    slug: { type: "string" },
    description: { type: "string" },
    phone: { type: "string" },
    hidden: { type: "boolean", default: false },
    site: { type: "string", default: LIVE_SITE },
  },
});
if (!values.name || !values["admin-email"]) {
  console.error('Usage: npm run org -- --name "<organization name>" --admin-email <address> [--slug <slug>] [--description <text>] [--phone <number>] [--hidden]');
  process.exit(1);
}

// "Maryland Legal Aid" → "maryland-legal-aid"
const slug =
  values.slug ??
  values.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const supabase = adminClient();
const { data: org, error } = await supabase
  .from("organizations")
  .insert({
    slug,
    name: values.name,
    description: values.description ?? null,
    short_description: values.description ?? null,
    callback_phone: values.phone ?? null,
    accepts_referrals: !values.hidden,
  })
  .select("id, name")
  .single();
if (error) {
  console.error(error.code === "23505" ? `An organization with slug "${slug}" already exists.` : `Couldn’t create it: ${error.message}`);
  process.exit(1);
}
console.log(`Created ${org.name} (slug: ${slug})${values.hidden ? ", hidden from tenants for now" : ""}.`);
await inviteAdvocate(supabase, { org, email: values["admin-email"], role: "supervising_attorney", admin: true, site: values.site });
