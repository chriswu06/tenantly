import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { requireAdvocate } from "@/lib/auth";
import { siteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import type { Case, LicenseStatus } from "@/types/case";
import type { Database } from "@/types/database";
import { formatDateOnly, formatDateTime, formatStamp, splitAddress } from "./format";

/*
 * Advocate console data. Every query runs as the signed-in advocate, so
 * row-level security limits it to their organization's cases.
 */

type LicenseResultDb = Database["public"]["Enums"]["license_result"];
export type LicenseResult = Exclude<LicenseResultDb, "pending"> | "pending";

export type AdvocateCase = Case & { licenseResult: LicenseResult; sharedAt: string | null; tenantFirstName: string | null; tenantPhone: string | null };

export type Metric = {
  label: string;
  shortLabel?: string;
  value: string;
  note?: string;
  shortNote?: string;
  tone?: "ok" | "warn" | "muted";
};

export type CaseFilter = "all" | "needs-certification" | "no-license" | "needs-review";

const CASE_COLUMNS =
  "id, reference, stage, property_address, case_number, court, landlord_name, filing_date, hearing_at, license_number_on_complaint, license_result, extracted, outcome, created_at, updated_at, shared_at, tenant_first_name, tenant_phone, assignee:advocates!cases_assignee_id_fkey(full_name)";

type CaseListRow = {
  id: string;
  reference: string;
  stage: Database["public"]["Enums"]["case_stage"];
  property_address: string | null;
  case_number: string | null;
  court: string | null;
  landlord_name: string | null;
  filing_date: string | null;
  hearing_at: string | null;
  license_number_on_complaint: string | null;
  license_result: LicenseResultDb;
  extracted: unknown;
  outcome: Database["public"]["Enums"]["case_outcome"] | null;
  created_at: string;
  updated_at: string;
  shared_at: string | null;
  tenant_first_name: string | null;
  tenant_phone: string | null;
  assignee: { full_name: string } | null;
};

const statusFor: Record<LicenseResultDb, LicenseStatus> = {
  pending: "not_checked",
  no_license: "no_license_found",
  expired: "no_license_found",
  active: "verified",
  needs_review: "not_checked",
  could_not_verify: "unclear",
};

function toAdvocateCase(r: CaseListRow): AdvocateCase {
  return {
    id: r.id,
    reference: r.reference,
    caseNumber: r.case_number ?? "",
    stage: r.stage,
    court: r.court ?? "",
    propertyAddress: r.property_address ?? "",
    landlordName: r.landlord_name ?? "",
    filingDate: r.filing_date ?? "",
    hearingDate: r.hearing_at ?? "",
    licenseNumberOnComplaint: r.license_number_on_complaint,
    licenseStatus: statusFor[r.license_result],
    assignee: r.assignee?.full_name ?? null,
    outcome: r.outcome,
    extracted: r.extracted as Case["extracted"],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    licenseResult: r.license_result,
    sharedAt: r.shared_at,
    tenantFirstName: r.tenant_first_name,
    tenantPhone: r.tenant_phone,
  };
}

/* Cases list ------------------------------------------------------------------------ */

export const CASES_PER_PAGE = 8;

export const caseFilterDefs: { key: CaseFilter; label: string; shortLabel?: string }[] = [
  { key: "all", label: "All" },
  { key: "needs-certification", label: "Needs certification", shortLabel: "Needs cert." },
  { key: "no-license", label: "No license" },
  { key: "needs-review", label: "Needs review", shortLabel: "Review" },
];

export function parseCaseFilter(value: string | string[] | undefined): CaseFilter {
  const key = Array.isArray(value) ? value[0] : value;
  return caseFilterDefs.some((f) => f.key === key) ? (key as CaseFilter) : "all";
}

type Query = ReturnType<Awaited<ReturnType<typeof createClient>>["from"]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilter<Q extends Query | any>(query: Q, filter: CaseFilter): Q {
  const q = query as ReturnType<Query["select"]>;
  switch (filter) {
    case "needs-certification":
      return q.eq("stage", "needs_certification") as Q;
    case "no-license":
      return q.in("license_result", ["no_license", "expired"]) as Q;
    case "needs-review":
      return q.in("license_result", ["needs_review", "could_not_verify"]) as Q;
    default:
      return query;
  }
}

/** Escapes a search term for PostgREST's `or=(… .ilike.*term*)` syntax. */
function ilikeTerm(q: string) {
  return `*${q.replace(/[,()*\\]/g, " ").trim()}*`;
}

/** One page of the organization's cases, searched and filtered, newest first. */
export async function listCases({ q = "", filter = "all", page = 1 }: { q?: string; filter?: CaseFilter; page?: number }) {
  await requireAdvocate();
  const supabase = await createClient();
  const from = (Math.max(1, page) - 1) * CASES_PER_PAGE;

  let query = supabase.from("cases").select(CASE_COLUMNS, { count: "exact" });
  query = applyFilter(query, filter);
  if (q.trim()) {
    const term = ilikeTerm(q);
    query = query.or(`reference.ilike.${term},property_address.ilike.${term},case_number.ilike.${term},landlord_name.ilike.${term}`);
  }
  const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, from + CASES_PER_PAGE - 1);
  if (error) throw new Error(`Couldn’t load cases: ${error.message}`);

  const total = count ?? 0;
  return {
    cases: (data as unknown as CaseListRow[]).map(toAdvocateCase),
    total,
    page: Math.max(1, page),
    pageCount: Math.max(1, Math.ceil(total / CASES_PER_PAGE)),
  };
}

/** Case counts for each filter tab (unaffected by the search box). */
export const caseFilterCounts = cache(async () => {
  const supabase = await createClient();
  const counts = await Promise.all(
    caseFilterDefs.map(async (f) => {
      const { count } = await applyFilter(supabase.from("cases").select("id", { count: "exact", head: true }), f.key);
      return [f.key, count ?? 0] as const;
    }),
  );
  return Object.fromEntries(counts) as Record<CaseFilter, number>;
});

/* Metrics ------------------------------------------------------------------------------- */

const DAY = 86_400_000;
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

type MetricRow = {
  created_at: string;
  license_result: LicenseResultDb;
  hearing_at: string | null;
  stage: Database["public"]["Enums"]["case_stage"];
  outcome: Database["public"]["Enums"]["case_outcome"] | null;
  certification_requested_at: string | null;
  outcome_reported_at: string | null;
};

/** Anonymous outcome reports (no case link), for the outcome charts and metrics. */
const outcomeReports = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("outcome_reports").select("outcome, reported_on");
  return data ?? [];
});

/** All of the organization's cases, slim, for the dashboards. Cached per request. */
const metricRows = cache(async (): Promise<MetricRow[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cases")
    .select("created_at, license_result, hearing_at, stage, outcome, certification_requested_at, outcome_reported_at");
  return (data ?? []) as MetricRow[];
});

/** Overview and Cases metrics (frames 50, 11). */
export async function getCaseMetrics(): Promise<Metric[]> {
  const rows = await metricRows();
  const now = Date.now();
  const last30 = rows.filter((r) => now - Date.parse(r.created_at) < 30 * DAY);
  const prior30 = rows.filter((r) => {
    const age = now - Date.parse(r.created_at);
    return age >= 30 * DAY && age < 60 * DAY;
  });
  const checked = last30.filter((r) => r.license_result !== "pending");
  const noLicense = checked.filter((r) => r.license_result === "no_license" || r.license_result === "expired");
  const weekEnd = now + 7 * DAY;
  const thisWeek = rows.filter((r) => r.hearing_at && Date.parse(r.hearing_at) >= now - DAY && Date.parse(r.hearing_at) < weekEnd);
  const needCert = thisWeek.filter((r) => !r.certification_requested_at && (r.license_result === "no_license" || r.license_result === "expired"));
  const outcomes = await outcomeReports();
  const raised = outcomes.filter((r) => r.outcome === "raised_license_defense" || r.outcome === "case_dismissed");
  const change = prior30.length ? Math.round(((last30.length - prior30.length) / prior30.length) * 100) : null;

  return [
    {
      label: "License checks",
      value: String(checked.length),
      note: change === null ? "Last 30 days" : `${change >= 0 ? "+" : ""}${change}% vs prior 30 days`,
      shortNote: change === null ? "30 days" : `${change >= 0 ? "+" : ""}${change}%`,
      tone: change !== null && change >= 0 ? "ok" : undefined,
    },
    { label: "No active license found", shortLabel: "No license found", value: String(noLicense.length), note: `${pct(noLicense.length, checked.length)}% of checks`, shortNote: `${pct(noLicense.length, checked.length)}%` },
    { label: "Hearings this week", value: String(thisWeek.length), note: `${needCert.length} need certification`, shortNote: `${needCert.length} need cert.`, tone: needCert.length ? "warn" : undefined },
    { label: "Defense raised (reported)", shortLabel: "Defense raised", value: String(raised.length), note: `${pct(raised.length, outcomes.length)}% of reported outcomes`, shortNote: `${pct(raised.length, outcomes.length)}%` },
  ];
}

/* Overview ------------------------------------------------------------------------------- */

export type Hearing = { day: string; address: string; reference: string; result: LicenseResult; certification: "requested" | "not_requested" | null };
export type AttentionItem = { kind: "certification" | "verify" | "unassigned"; title: string; reference: string; hearing: string; action: string };
export type OutcomeCount = { label: string; count: number };

const outcomeLabels: Record<Database["public"]["Enums"]["case_outcome"], string> = {
  raised_license_defense: "Raised the license defense",
  case_dismissed: "Case dismissed",
  case_postponed: "Case postponed",
  did_not_raise_defense: "Did not raise the defense",
  did_not_attend: "Did not attend",
};

function weekdayDate(iso: string) {
  const d = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", month: "numeric", day: "numeric" }).format(new Date(iso));
  return d.replace(",", "");
}
function monthDay(iso: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric" }).format(new Date(iso));
}

export async function getOverview() {
  await requireAdvocate();
  const supabase = await createClient();
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * DAY);
  const { data: upcoming } = await supabase
    .from("cases")
    .select("reference, property_address, hearing_at, license_result, certification_requested_at, assignee_id, stage")
    .gte("hearing_at", new Date(now.getTime() - DAY).toISOString())
    .order("hearing_at");
  const rows = upcoming ?? [];

  const hearings: Hearing[] = rows
    .filter((r) => r.hearing_at && Date.parse(r.hearing_at) < weekEnd.getTime())
    .slice(0, 6)
    .map((r) => ({
      day: weekdayDate(r.hearing_at!),
      address: splitAddress(r.property_address).street,
      reference: r.reference,
      result: r.license_result,
      certification:
        r.license_result === "no_license" || r.license_result === "expired"
          ? r.certification_requested_at
            ? "requested"
            : "not_requested"
          : null,
    }));

  const attention: AttentionItem[] = [];
  for (const r of rows) {
    const hearing = r.hearing_at ? monthDay(r.hearing_at) : "";
    if ((r.license_result === "no_license" || r.license_result === "expired") && !r.certification_requested_at) {
      attention.push({ kind: "certification", title: "Request certification", reference: r.reference, hearing, action: "Open" });
    } else if (r.license_result === "could_not_verify" || r.license_result === "needs_review") {
      attention.push({ kind: "verify", title: "Could not verify license", reference: r.reference, hearing, action: "Review" });
    } else if (!r.assignee_id) {
      attention.push({ kind: "unassigned", title: "Unassigned case", reference: r.reference, hearing, action: "Assign" });
    }
  }

  const outcomes = (await outcomeReports()).filter((r) => now.getTime() - Date.parse(r.reported_on) < 30 * DAY);
  const outcomesLast30Days: OutcomeCount[] = (Object.keys(outcomeLabels) as (keyof typeof outcomeLabels)[]).map((key) => ({
    label: outcomeLabels[key],
    count: outcomes.filter((r) => r.outcome === key).length,
  }));

  return { hearings, attention: attention.slice(0, 5), outcomesLast30Days };
}

/* Case detail -------------------------------------------------------------------------------- */

export type NextAction = { label: string; due: string; done?: boolean; urgent?: boolean };
export type ActivityEvent = { title: string; meta: string };
export type CaseRecord = { number: string; status: "Expired" | "Active"; validFrom: string; validTo: string; source: string };
export type CaseDetailData = {
  result: { tone: "ok" | "warn" | "danger"; text: string; mobileText: string; recordsText: string };
  records: CaseRecord[];
  lookupMeta: { checked: string; source: string; match: string };
  nextActions: NextAction[];
  activity: ActivityEvent[];
};

function resultCopy(c: AdvocateCase, records: CaseRecord[]): CaseDetailData["result"] {
  const filed = formatDateOnly(c.filingDate);
  const lastExpired = records.find((r) => r.status === "Expired")?.validTo;
  switch (c.licenseResult) {
    case "no_license":
      return { tone: "ok", text: `No rental license was found for this address on the filing date (${filed}).`, mobileText: `No license found for the filing date (${filed}).`, recordsText: `No license active on the filing date (${filed}).` };
    case "expired":
      return {
        tone: "ok",
        text: `No license was active on the filing date (${filed}).${lastExpired ? ` Most recent license expired ${lastExpired}.` : ""}`,
        mobileText: `No license active on the filing date (${filed}).${lastExpired ? ` Last license expired ${lastExpired}.` : ""}`,
        recordsText: `No license active on the filing date (${filed}).`,
      };
    case "active":
      return { tone: "warn", text: `An active rental license covered the filing date (${filed}). The license defense likely doesn’t apply.`, mobileText: "Active license on the filing date.", recordsText: "Active license on the filing date." };
    case "needs_review":
      return { tone: "warn", text: "The license records conflict. Check the DHCD lookup before advising the tenant.", mobileText: "License records need review.", recordsText: "License records need review." };
    case "could_not_verify":
      return { tone: "danger", text: "DHCD records couldn’t be checked automatically, and the tenant hasn’t completed the guided check.", mobileText: "Could not verify the license yet.", recordsText: "Could not verify the license yet." };
    default:
      return { tone: "warn", text: "The license hasn’t been checked yet.", mobileText: "Not checked yet.", recordsText: "Not checked yet." };
  }
}

export const getCaseDetail = cache(async (reference: string) => {
  await requireAdvocate();
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select(`${CASE_COLUMNS}, certification_requested_at, certification_received_at, normalized_address`).eq("reference", reference).maybeSingle();
  if (!data) notFound();
  const row = data as unknown as CaseListRow & { certification_requested_at: string | null; certification_received_at: string | null; normalized_address: string | null };
  const c = toAdvocateCase(row);

  const [records, checks, events] = await Promise.all([
    supabase.from("license_records").select("*").eq("case_id", row.id).order("valid_to", { ascending: false }),
    supabase.from("license_checks").select("*").eq("case_id", row.id).order("checked_at", { ascending: false }).limit(1),
    supabase.from("case_events").select("*").eq("case_id", row.id).neq("title", "Demo data").order("created_at"),
  ]);

  const caseRecords: CaseRecord[] = (records.data ?? []).map((r) => ({
    number: r.license_number,
    status: r.status === "active" ? "Active" : "Expired",
    validFrom: formatDateOnly(r.valid_from),
    validTo: formatDateOnly(r.valid_to),
    source: r.source,
  }));
  const lastCheck = checks.data?.[0];
  const md = (iso: string | null) => (iso ? formatStamp(iso).slice(0, 5) : "");

  const noDefense = c.licenseResult === "active";
  const nextActions: NextAction[] = [
    { label: "License check completed", due: lastCheck ? md(lastCheck.checked_at) : "", done: c.licenseResult !== "pending" && c.licenseResult !== "could_not_verify" },
    {
      label: row.certification_received_at ? "DHCD certification received" : "Request DHCD certification",
      due: row.certification_received_at ? md(row.certification_received_at) : row.certification_requested_at ? `Requested ${md(row.certification_requested_at)}` : "Before hearing",
      done: Boolean(row.certification_received_at),
      urgent: !row.certification_requested_at && !noDefense,
    },
    { label: "Confirm documents with tenant", due: row.tenant_phone ?? "", done: false },
    { label: noDefense ? "Attend hearing" : "Attend hearing · raise defense", due: c.hearingDate ? md(c.hearingDate) : "", done: c.stage === "closed" },
  ];

  const detail: CaseDetailData = {
    result: resultCopy(c, caseRecords),
    records: caseRecords,
    lookupMeta: {
      checked: lastCheck ? `Checked ${formatDateTime(lastCheck.checked_at)}` : "Not checked yet",
      source: lastCheck?.source ?? "Baltimore City DHCD",
      match: row.normalized_address ? `Matched on ${row.normalized_address}` : "Address not confirmed",
    },
    nextActions,
    activity: (events.data ?? []).map((e) => ({ title: e.title, meta: `${e.actor} · ${formatStamp(e.created_at)}` })),
  };
  return { caseData: c, detail, certificationRequestedAt: row.certification_requested_at, certificationReceivedAt: row.certification_received_at };
});

/* License lookups -------------------------------------------------------------------------------- */

export type Lookup = { time: string; address: string; result: LicenseResult; response: string | null; reference: string; method: "automatic" | "guided" };

export async function listLookups({ failedOnly = false, page = 1 }: { failedOnly?: boolean; page?: number }) {
  await requireAdvocate();
  const supabase = await createClient();
  const from = (Math.max(1, page) - 1) * 10;
  let query = supabase
    .from("license_checks")
    .select("checked_at, lookup_address, result, response_ms, method, error, cases!inner(reference, property_address)", { count: "exact" })
    .order("checked_at", { ascending: false });
  if (failedOnly) query = query.eq("result", "could_not_verify");
  const { data, count } = await query.range(from, from + 9);

  const lookups: Lookup[] = (data ?? []).map((l) => ({
    time: formatStamp(l.checked_at),
    address: splitAddress(l.cases.property_address).street || l.lookup_address || "",
    result: l.result,
    response: l.response_ms != null ? `${(l.response_ms / 1000).toFixed(1)}s` : null,
    reference: l.cases.reference,
    method: l.method as Lookup["method"],
  }));
  return { lookups, total: count ?? 0, pageCount: Math.max(1, Math.ceil((count ?? 0) / 10)) };
}

/** Every lookup (newest first, up to 5,000) for the "Export CSV" download. */
export async function listAllLookups({ failedOnly = false }: { failedOnly?: boolean } = {}) {
  await requireAdvocate();
  const supabase = await createClient();
  let query = supabase
    .from("license_checks")
    .select("checked_at, lookup_address, result, response_ms, method, error, cases!inner(reference, property_address)")
    .order("checked_at", { ascending: false });
  if (failedOnly) query = query.eq("result", "could_not_verify");
  const { data } = await query.range(0, 4999);
  return (data ?? []).map((l) => ({
    checkedAt: l.checked_at,
    address: splitAddress(l.cases.property_address).street || l.lookup_address || "",
    result: l.result as LicenseResult,
    responseMs: l.response_ms,
    method: l.method,
    error: l.error,
    reference: l.cases.reference,
  }));
}

export async function getLookupMetrics(): Promise<Metric[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - 7 * DAY).toISOString();
  const { data } = await supabase.from("license_checks").select("result, response_ms, method").gte("checked_at", since);
  const rows = data ?? [];
  const automatic = rows.filter((r) => r.method === "automatic");
  const failed = automatic.filter((r) => r.result === "could_not_verify").length;
  const times = automatic.map((r) => r.response_ms).filter((n): n is number => n != null).sort((a, b) => a - b);
  const median = times.length ? times[Math.floor(times.length / 2)] : null;
  return [
    { label: "Lookups (7 days)", value: String(rows.length), shortNote: "All cases" },
    {
      label: "Success rate",
      value: automatic.length ? `${(((automatic.length - failed) / automatic.length) * 100).toFixed(1)}%` : "—",
      note: `${failed} failed`,
      tone: failed ? "warn" : undefined,
    },
    { label: "Median response", value: median != null ? `${(median / 1000).toFixed(1)}s` : "—", note: "DHCD records" },
  ];
}

/* Reports ---------------------------------------------------------------------------------------- */

export async function getReports() {
  await requireAdvocate();
  const rows = await metricRows();
  const supabase = await createClient();
  const { count: shared } = await supabase.from("cases").select("id", { count: "exact", head: true }).not("shared_at", "is", null);

  const months: { month: string; start: number; end: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({ month: start.toLocaleString("en-US", { month: "short" }), start: start.getTime(), end: end.getTime() });
  }
  const inRange = rows.filter((r) => Date.parse(r.created_at) >= months[0].start);
  const checked = inRange.filter((r) => r.license_result !== "pending");
  const noLicense = checked.filter((r) => r.license_result === "no_license" || r.license_result === "expired");
  const outcomes = (await outcomeReports()).filter((r) => Date.parse(r.reported_on) >= months[0].start);
  const raised = outcomes.filter((r) => r.outcome === "raised_license_defense" || r.outcome === "case_dismissed");
  const range = `${months[0].month}–${months.at(-1)!.month} ${now.getFullYear()}`;

  const reportMetrics: Metric[] = [
    { label: "License checks", value: String(checked.length), note: range },
    { label: "No active license found", value: `${pct(noLicense.length, checked.length)}%`, note: `${noLicense.length} checks` },
    { label: "Cases shared with legal aid", value: String(shared ?? 0), note: `${pct(shared ?? 0, checked.length)}% of checks` },
    { label: "Defense raised (reported)", value: `${pct(raised.length, outcomes.length)}%`, note: `of ${outcomes.length} outcome reports` },
  ];
  const checksPerMonth = months.map(({ month, start, end }) => {
    const m = checked.filter((r) => Date.parse(r.created_at) >= start && Date.parse(r.created_at) < end);
    return { month, total: m.length, noLicense: m.filter((r) => r.license_result === "no_license" || r.license_result === "expired").length };
  });
  const outcomesLast6Months: OutcomeCount[] = (Object.keys(outcomeLabels) as (keyof typeof outcomeLabels)[]).map((key) => ({
    label: outcomeLabels[key],
    count: outcomes.filter((r) => r.outcome === key).length,
  }));
  return { reportMetrics, checksPerMonth, outcomesLast6Months, range };
}

/* Team --------------------------------------------------------------------------------------------- */

export type TeamMember = {
  id: string;
  name: string | null;
  initials: string;
  email: string;
  role: string;
  access: "Admin" | "Member";
  openCases: number | null;
  status: "active" | "invited";
  inviteLink?: string;
};

export async function getTeam() {
  const me = await requireAdvocate();
  const supabase = await createClient();
  const [{ data: members }, { data: invites }, { data: open }] = await Promise.all([
    supabase.from("advocates").select("id, full_name, email, role, is_admin").order("full_name"),
    supabase.from("invitations").select("id, email, role, is_admin, token, expires_at").is("accepted_at", null).order("created_at", { ascending: false }),
    supabase.from("cases").select("assignee_id").neq("stage", "closed").not("assignee_id", "is", null),
  ]);
  const { advocateRoleLabels } = await import("@/lib/validation/schemas");
  const openBy = new Map<string, number>();
  (open ?? []).forEach((c) => openBy.set(c.assignee_id!, (openBy.get(c.assignee_id!) ?? 0) + 1));

  const site = await siteUrl();
  const team: TeamMember[] = [
    ...(members ?? []).map((m) => ({
      id: m.id,
      name: m.full_name,
      initials: m.full_name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
      email: m.email,
      role: advocateRoleLabels[m.role],
      access: (m.is_admin ? "Admin" : "Member") as TeamMember["access"],
      openCases: openBy.get(m.id) ?? 0,
      status: "active" as const,
    })),
    ...(invites ?? [])
      .filter((i) => new Date(i.expires_at) > new Date())
      .map((i) => ({
        id: i.id,
        name: null,
        initials: i.email.slice(0, 2).toUpperCase(),
        email: i.email,
        role: advocateRoleLabels[i.role],
        access: (i.is_admin ? "Admin" : "Member") as TeamMember["access"],
        openCases: null,
        status: "invited" as const,
        inviteLink: me.isAdmin ? `${site}/advocate/sign-up?invite=${i.token}` : undefined,
      })),
  ];
  return { team, canInvite: me.isAdmin };
}

/** Street line for display. */
export { splitAddress };
