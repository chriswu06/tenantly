// Demo data for trying the advocate console.
//
//   npm run seed:demo -- --org pjc --email you@example.org --password '…' [--name "Jordan Rivera"]
//   npm run seed:demo -- --org pjc --remove
//
// Creates (or reuses) an admin advocate with that email and password, and 12
// demo cases shared with the organization. Hearing dates are relative to today.
// Every demo case has a "Demo data" event, which is how --remove finds and
// deletes them again.
import { createClient } from "@supabase/supabase-js";
import { randomBytes, createHash } from "node:crypto";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    org: { type: "string", default: "pjc" },
    email: { type: "string" },
    password: { type: "string" },
    name: { type: "string", default: "Jordan Rivera" },
    remove: { type: "boolean", default: false },
  },
});

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const { data: org } = await db.from("organizations").select("id, name").eq("slug", values.org).single();
if (!org) throw new Error(`No organization "${values.org}"`);

if (values.remove) {
  const { data: marked } = await db.from("case_events").select("case_id").eq("title", "Demo data");
  const ids = [...new Set((marked ?? []).map((e) => e.case_id))];
  if (ids.length) await db.from("cases").delete().in("id", ids);
  console.log(`Removed ${ids.length} demo cases.`);
  process.exit(0);
}

// Advocate
let advocateId = null;
if (values.email) {
  if (!values.password || values.password.length < 12) throw new Error("--password must be at least 12 characters");
  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
  let user = list.users.find((u) => u.email === values.email.toLowerCase());
  if (!user) {
    const { data, error } = await db.auth.admin.createUser({ email: values.email, password: values.password, email_confirm: true });
    if (error) throw error;
    user = data.user;
  } else {
    await db.auth.admin.updateUserById(user.id, { password: values.password });
  }
  await db.from("advocates").upsert({
    id: user.id,
    organization_id: org.id,
    full_name: values.name,
    email: values.email.toLowerCase(),
    role: "staff_attorney",
    is_admin: true,
  });
  advocateId = user.id;
  console.log(`Advocate ready: ${values.email} (admin, ${org.name})`);
}

// Cases
const day = 86_400_000;
const at = (days, hour = 9) => {
  const d = new Date(Date.now() + days * day);
  d.setUTCHours(hour + 4, 0, 0, 0); // 9:00 AM Eastern (daylight time)
  return d.toISOString();
};
const date = (days) => new Date(Date.now() + days * day).toISOString().slice(0, 10);

const seeds = [
  ["2417 E Monument St, Apt 2, Baltimore, MD 21205", "Harbor Point Rentals LLC", -9, 16, "expired", "needs_certification"],
  ["1102 N Charles St, #3F, Baltimore, MD 21201", "Calvert Residential Mgmt", -11, 11, "needs_review", "verifying"],
  ["3310 Greenmount Ave, Baltimore, MD 21218", "Oriole Property Group", -12, 11, "active", "ready_for_court"],
  ["725 W Lombard St, Apt 12, Baltimore, MD 21201", "Harbor Point Rentals LLC", -13, 9, "expired", "ready_for_court"],
  ["4808 Park Heights Ave, Baltimore, MD 21215", "Fells Holdings LLC", -15, 8, "could_not_verify", "verifying"],
  ["19 S Collington Ave, Baltimore, MD 21231", "Patapsco Homes Inc", -16, 8, "no_license", "needs_certification"],
  ["2230 Druid Hill Ave, #2, Baltimore, MD 21217", "Calvert Residential Mgmt", -17, 4, "active", "ready_for_court"],
  ["612 N Milton Ave, Baltimore, MD 21205", "Oriole Property Group", -18, 1, "no_license", "ready_for_court"],
  ["1507 E Baltimore St, Baltimore, MD 21231", "Chesapeake Living LLC", -40, -20, "no_license", "closed"],
  ["3900 Hayward Ave, Baltimore, MD 21215", "Fells Holdings LLC", -55, -35, "expired", "closed"],
  ["801 Cathedral St, Apt 5B, Baltimore, MD 21201", "Mount Vernon Flats LP", -75, -50, "active", "closed"],
  ["2101 W North Ave, Baltimore, MD 21217", "Patapsco Homes Inc", -110, -85, "no_license", "closed"],
];
const outcomes = ["raised_license_defense", "case_dismissed", "did_not_attend", "raised_license_defense"];

let made = 0;
for (const [i, [address, landlord, filedDaysAgo, hearingInDays, result, stage]] of seeds.entries()) {
  const created = new Date(Date.now() + filedDaysAgo * day + 2 * day).toISOString();
  const { data: c, error } = await db
    .from("cases")
    .insert({
      access_token_hash: createHash("sha256").update(randomBytes(32)).digest("hex"),
      stage,
      property_address: address,
      normalized_address: address.replace(/, (Apt|#)[^,]+/, "").replace("MD", "Maryland"),
      in_baltimore_city: true,
      jurisdiction: "Baltimore City",
      case_number: `D-01-LT-26-00${4821 - i * 37}`,
      court: "District Court, 501 E Fayette St",
      landlord_name: landlord,
      filing_date: date(filedDaysAgo),
      hearing_at: at(hearingInDays),
      license_result: result,
      organization_id: org.id,
      assignee_id: i % 3 === 2 ? null : advocateId,
      tenant_first_name: ["Denise", "Marcus", "Alicia", "Terrence", "Keisha", "Robert"][i % 6],
      tenant_phone: `(410) 555-01${String(40 + i).padStart(2, "0")}`,
      shared_at: created,
      certification_requested_at: stage === "ready_for_court" || stage === "closed" ? created : null,
      created_at: created,
    })
    .select("id")
    .single();
  if (error) throw error;

  if (result === "expired" || result === "active") {
    await db.from("license_records").insert([
      { case_id: c.id, license_number: `RL-2023-${118804 - i * 97}`, status: result === "active" ? "active" : "expired", valid_from: "2023-04-01", valid_to: result === "active" ? "2027-03-31" : "2025-03-31", source: "DHCD license lookup" },
      { case_id: c.id, license_number: `RL-2021-${97132 - i * 53}`, status: "expired", valid_from: "2021-04-01", valid_to: "2023-03-31", source: "DHCD license lookup" },
    ]);
  }
  await db.from("license_checks").insert({
    case_id: c.id,
    method: result === "could_not_verify" ? "automatic" : "guided",
    result,
    source: result === "could_not_verify" ? "Baltimore City DHCD" : "Tenant guided check",
    lookup_address: address,
    checked_at: created,
  });
  await db.from("case_events").insert([
    { case_id: c.id, actor: "System", title: "Demo data", created_at: created },
    { case_id: c.id, actor: "Tenant", title: "Case created from tenant scan", created_at: created },
    { case_id: c.id, actor: "System", title: "Summons fields extracted (7/7)", created_at: created },
    { case_id: c.id, actor: "Tenant", title: `Tenant shared case with ${org.name}`, created_at: created },
  ]);
  if (stage === "closed") {
    // Outcomes are anonymous: stored apart from the case (see migration 0004).
    await db.from("outcome_reports").insert({ outcome: outcomes[i % outcomes.length], reported_on: date(hearingInDays + 1) });
  }
  made += 1;
}
console.log(`Created ${made} demo cases for ${org.name}.`);
