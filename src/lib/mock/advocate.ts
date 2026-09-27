import type { BadgeTone } from "@/components/ui/Badge";
import type { Case, CaseStage, LicenseStatus } from "@/types/case";
import { getMockCase } from "@/lib/mock-data";

/*
 * Mock data for the advocate console (Figma frames 11, 12, 50–65).
 * No fetching: pages read these directly until Supabase is wired up.
 */

/** "Today" in the Figma frames (Sunday, September 27, 2026). Fixed so the mock never drifts. */
export const MOCK_TODAY = "2026-09-27";

/** Result of the DHCD license check, as shown in the status badges. */
export type LicenseResult = "no_license" | "expired" | "active" | "needs_review" | "could_not_verify";

export const licenseResultBadge: Record<LicenseResult, { label: string; tone: BadgeTone }> = {
  // "No license" is the good outcome for the tenant (the defense applies), so it is green.
  no_license: { label: "No license found", tone: "ok" },
  expired: { label: "License expired", tone: "ok" },
  active: { label: "Active license", tone: "neutral" },
  needs_review: { label: "Needs review", tone: "warn" },
  could_not_verify: { label: "Could not verify", tone: "danger" },
};

export type AdvocateCase = Case & { licenseResult: LicenseResult };

type CaseSeed = {
  reference: string;
  propertyAddress: string;
  landlordName: string;
  filingDate: string;
  hearingDate: string;
  stage: CaseStage;
  licenseResult: LicenseResult;
  assignee: string | null;
};

const statusFor: Record<LicenseResult, LicenseStatus> = {
  no_license: "no_license_found",
  expired: "no_license_found",
  active: "verified",
  needs_review: "not_checked",
  could_not_verify: "unclear",
};

function makeCase(seed: CaseSeed, index: number): AdvocateCase {
  const base = getMockCase();
  const caseNumber = `D-01-LT-26-00${4821 - index * 37}`;
  return {
    ...base,
    id: seed.reference,
    reference: seed.reference,
    caseNumber,
    stage: seed.stage,
    propertyAddress: seed.propertyAddress,
    landlordName: seed.landlordName,
    filingDate: seed.filingDate,
    hearingDate: seed.hearingDate,
    licenseStatus: statusFor[seed.licenseResult],
    assignee: seed.assignee,
    licenseResult: seed.licenseResult,
    extracted: {
      ...base.extracted,
      propertyAddress: { value: seed.propertyAddress, confidence: "confirmed" },
      caseNumber: { value: caseNumber, confidence: "confirmed" },
      landlordName: { value: seed.landlordName, confidence: "confirmed" },
      hearingDate: { value: seed.hearingDate, confidence: "confirmed" },
      filingDate: { value: seed.filingDate, confidence: "confirmed" },
    },
  };
}

const firstCase = getMockCase();

/** First page of the cases list (frame 11). The first case is the one in `getMockCase()`. */
export const advocateCases: AdvocateCase[] = [
  { ...firstCase, id: firstCase.reference, licenseResult: "no_license" },
  ...(
    [
      {
        reference: "STD-2026-0409",
        propertyAddress: "1102 N Charles St, #3F",
        landlordName: "Calvert Residential Mgmt",
        filingDate: "2026-09-16",
        hearingDate: "2026-10-08T09:00:00-04:00",
        stage: "needs_review",
        licenseResult: "needs_review",
        assignee: "M. Chen",
      },
      {
        reference: "STD-2026-0407",
        propertyAddress: "3310 Greenmount Ave",
        landlordName: "Oriole Property Group",
        filingDate: "2026-09-15",
        hearingDate: "2026-10-08T09:00:00-04:00",
        stage: "verifying",
        licenseResult: "active",
        assignee: null,
      },
      {
        reference: "STD-2026-0405",
        propertyAddress: "725 W Lombard St, Apt 12",
        landlordName: "Harbor Point Rentals LLC",
        filingDate: "2026-09-14",
        hearingDate: "2026-10-06T09:00:00-04:00",
        stage: "needs_certification",
        licenseResult: "expired",
        assignee: "J. Rivera",
      },
      {
        reference: "STD-2026-0401",
        propertyAddress: "4808 Park Heights Ave",
        landlordName: "Fells Holdings LLC",
        filingDate: "2026-09-12",
        hearingDate: "2026-10-05T09:00:00-04:00",
        stage: "verifying",
        licenseResult: "could_not_verify",
        assignee: "A. Okafor",
      },
      {
        reference: "STD-2026-0398",
        propertyAddress: "19 S Collington Ave",
        landlordName: "Patapsco Homes Inc",
        filingDate: "2026-09-11",
        hearingDate: "2026-10-05T09:00:00-04:00",
        stage: "needs_certification",
        licenseResult: "no_license",
        assignee: "M. Chen",
      },
      {
        reference: "STD-2026-0395",
        propertyAddress: "2230 Druid Hill Ave, #2",
        landlordName: "Calvert Residential Mgmt",
        filingDate: "2026-09-10",
        hearingDate: "2026-10-01T09:00:00-04:00",
        stage: "closed",
        licenseResult: "active",
        assignee: "A. Okafor",
      },
      {
        reference: "STD-2026-0391",
        propertyAddress: "612 N Milton Ave",
        landlordName: "Oriole Property Group",
        filingDate: "2026-09-09",
        hearingDate: "2026-09-30T09:00:00-04:00",
        stage: "ready_for_court",
        licenseResult: "no_license",
        assignee: "J. Rivera",
      },
    ] satisfies CaseSeed[]
  ).map((seed, i) => makeCase(seed, i + 1)),
];

export function getAdvocateCase(reference: string): AdvocateCase | undefined {
  return advocateCases.find((c) => c.reference === reference || c.id === reference);
}

/* ---------------------------------------------------------------------------------------------- */
/* Cases list filters (frame 11 toolbar, frame 11m pills)                                          */

export type CaseFilter = "all" | "needs-certification" | "no-license" | "needs-review";

export const caseFilters: { key: CaseFilter; label: string; shortLabel?: string; count: number }[] = [
  { key: "all", label: "All", count: 24 },
  { key: "needs-certification", label: "Needs certification", shortLabel: "Needs cert.", count: 9 },
  { key: "no-license", label: "No license", count: 11 },
  { key: "needs-review", label: "Needs review", shortLabel: "Review", count: 4 },
];

export function parseCaseFilter(value: string | string[] | undefined): CaseFilter {
  const key = Array.isArray(value) ? value[0] : value;
  return caseFilters.some((f) => f.key === key) ? (key as CaseFilter) : "all";
}

export function filterCases(cases: AdvocateCase[], filter: CaseFilter) {
  switch (filter) {
    case "needs-certification":
      return cases.filter((c) => c.stage === "needs_certification");
    case "no-license":
      return cases.filter((c) => c.licenseResult === "no_license" || c.licenseResult === "expired");
    case "needs-review":
      return cases.filter((c) => c.licenseResult === "needs_review");
    default:
      return cases;
  }
}

/* ---------------------------------------------------------------------------------------------- */
/* Metrics                                                                                          */

export type Metric = {
  label: string;
  /** Mobile label when it differs, e.g. "Defense raised". */
  shortLabel?: string;
  value: string;
  note?: string;
  shortNote?: string;
  tone?: "ok" | "warn" | "muted";
};

/** Overview and Cases metrics (frames 50, 11). */
export const caseMetrics: Metric[] = [
  { label: "License checks", value: "142", note: "+18% vs prior 30 days", shortNote: "+18%", tone: "ok" },
  { label: "No active license found", shortLabel: "No license found", value: "61", note: "43% of checks", shortNote: "43%" },
  { label: "Hearings this week", value: "23", note: "9 need certification", shortNote: "9 need cert.", tone: "warn" },
  { label: "Defense raised (reported)", shortLabel: "Defense raised", value: "38", note: "62% of reported outcomes", shortNote: "62%" },
];

/** License lookups health (frames 58, 59). */
export const lookupMetrics: Metric[] = [
  { label: "Lookups (7 days)", value: "214", shortNote: "All cases" },
  { label: "Success rate", value: "97.2%", note: "6 failed", tone: "warn" },
  { label: "Median response", value: "1.8s", note: "DHCD records" },
];

/** Impact report metrics (frames 60, 61). */
export const reportMetrics: Metric[] = [
  { label: "License checks", value: "812", note: "Apr–Sep 2026" },
  { label: "No active license found", value: "41%", note: "333 checks" },
  { label: "Cases shared with legal aid", value: "176", note: "22% of checks" },
  { label: "Defense raised (reported)", value: "58%", note: "of 212 outcome reports" },
];

/* ---------------------------------------------------------------------------------------------- */
/* Overview (frames 50, 51)                                                                         */

export type Hearing = {
  day: string;
  address: string;
  reference: string;
  result: LicenseResult;
  certification: "requested" | "not_requested" | null;
};

export const hearingsThisWeek: Hearing[] = [
  { day: "Mon 9/28", address: "612 N Milton Ave", reference: "STD-2026-0391", result: "no_license", certification: "requested" },
  { day: "Thu 10/1", address: "2230 Druid Hill Ave, #2", reference: "STD-2026-0395", result: "active", certification: null },
  { day: "Mon 10/5", address: "19 S Collington Ave", reference: "STD-2026-0398", result: "no_license", certification: "not_requested" },
  { day: "Mon 10/5", address: "4808 Park Heights Ave", reference: "STD-2026-0401", result: "could_not_verify", certification: null },
];

export type AttentionItem = {
  kind: "certification" | "verify" | "unassigned";
  title: string;
  reference: string;
  hearing: string;
  action: string;
};

export const needsAttention: AttentionItem[] = [
  { kind: "certification", title: "Request certification", reference: "STD-2026-0412", hearing: "Oct 13", action: "Due 10/02" },
  { kind: "verify", title: "Could not verify license", reference: "STD-2026-0401", hearing: "Oct 5", action: "Re-run" },
  { kind: "unassigned", title: "Unassigned case", reference: "STD-2026-0407", hearing: "Oct 8", action: "Assign" },
];

export type OutcomeCount = { label: string; count: number };

export const outcomesLast30Days: OutcomeCount[] = [
  { label: "Raised the license defense", count: 38 },
  { label: "Case dismissed", count: 14 },
  { label: "Case postponed", count: 9 },
  { label: "Did not raise the defense", count: 6 },
  { label: "Did not attend", count: 4 },
];

export const outcomesLast6Months: OutcomeCount[] = [
  { label: "Raised the license defense", count: 123 },
  { label: "Case dismissed", count: 41 },
  { label: "Case postponed", count: 25 },
  { label: "Did not raise the defense", count: 16 },
  { label: "Did not attend", count: 7 },
];

/** License checks per month (frame 60 chart). `noLicense` is the dark, bottom part of each bar. */
export const checksPerMonth: { month: string; total: number; noLicense: number }[] = [
  { month: "Apr", total: 62, noLicense: 25 },
  { month: "May", total: 98, noLicense: 40 },
  { month: "Jun", total: 121, noLicense: 50 },
  { month: "Jul", total: 149, noLicense: 61 },
  { month: "Aug", total: 184, noLicense: 75 },
  { month: "Sep", total: 198, noLicense: 82 },
];

/* ---------------------------------------------------------------------------------------------- */
/* License lookups (frames 58, 59)                                                                  */

export type Lookup = {
  time: string;
  address: string;
  result: LicenseResult;
  /** Response time, or null when the lookup timed out. */
  response: string | null;
  reference: string;
};

export const lookups: Lookup[] = [
  { time: "09/27 00:12", address: "725 W Lombard St, Apt 12", result: "expired", response: "1.6s", reference: "STD-2026-0405" },
  { time: "09/26 22:52", address: "2417 E Monument St, Apt 2", result: "no_license", response: "1.8s", reference: "STD-2026-0412" },
  { time: "09/26 21:40", address: "4808 Park Heights Ave", result: "could_not_verify", response: null, reference: "STD-2026-0401" },
  { time: "09/26 19:03", address: "3310 Greenmount Ave", result: "active", response: "2.1s", reference: "STD-2026-0407" },
  { time: "09/26 17:25", address: "1102 N Charles St, #3F", result: "needs_review", response: "1.9s", reference: "STD-2026-0409" },
  { time: "09/26 15:11", address: "19 S Collington Ave", result: "no_license", response: "1.4s", reference: "STD-2026-0398" },
];

/* ---------------------------------------------------------------------------------------------- */
/* Team (frames 62, 63)                                                                             */

export type TeamMember = {
  name: string | null;
  initials: string;
  email: string;
  role: string;
  access: "Admin" | "Member";
  openCases: number | null;
  status: "active" | "invited";
};

export const teamMembers: TeamMember[] = [
  { name: "Jordan Rivera", initials: "JR", email: "jrivera@publicjustice.org", role: "Staff attorney", access: "Member", openCases: 8, status: "active" },
  { name: "M. Chen", initials: "MC", email: "mchen@publicjustice.org", role: "Supervising attorney", access: "Admin", openCases: 5, status: "active" },
  { name: "A. Okafor", initials: "AO", email: "aokafor@publicjustice.org", role: "Paralegal", access: "Member", openCases: 6, status: "active" },
  { name: null, initials: "?", email: "tnguyen@publicjustice.org", role: "Staff attorney", access: "Member", openCases: null, status: "invited" },
];

export const memberRoles = ["Staff attorney", "Supervising attorney", "Paralegal", "Intake specialist"];

/* ---------------------------------------------------------------------------------------------- */
/* Case detail (frames 12, 12m, 52, 53)                                                            */

export type LicenseRecord = {
  number: string;
  status: "Expired" | "Active";
  validFrom: string;
  validTo: string;
  source: string;
};

export type NextAction = { label: string; due: string; done?: boolean; urgent?: boolean };

export type ActivityEvent = { title: string; meta: string };

export type CaseDetailData = {
  /** Long result for desktop and the Overview tab, short one for the mobile Records tab. */
  result: { tone: "ok" | "warn" | "danger"; text: string; mobileText: string; recordsText: string };
  records: LicenseRecord[];
  lookupMeta: { checked: string; source: string; match: string };
  nextActions: NextAction[];
  activity: ActivityEvent[];
};

const detail0412: CaseDetailData = {
  result: {
    tone: "ok",
    text: "No license was active on the filing date (09/18/2026). Most recent license expired 03/31/2025.",
    mobileText: "No license active on the filing date (09/18/2026). Last license expired 03/31/2025.",
    recordsText: "No license active on the filing date (09/18/2026).",
  },
  records: [
    { number: "RL-2023-118804", status: "Expired", validFrom: "04/01/2023", validTo: "03/31/2025", source: "DHCD license lookup" },
    { number: "RL-2021-097132", status: "Expired", validFrom: "04/01/2021", validTo: "03/31/2023", source: "DHCD license lookup" },
  ],
  lookupMeta: {
    checked: "Checked 09/26/2026 22:52 ET",
    source: "Baltimore City DHCD",
    match: "Matched on normalized address",
  },
  nextActions: [
    { label: "License check completed", due: "09/26", done: true },
    { label: "Request DHCD certification", due: "Due 10/02", urgent: true },
    { label: "Confirm documents with tenant", due: "Due 10/09" },
    { label: "Attend hearing · raise defense", due: "10/13" },
  ],
  activity: [
    { title: "Case created from tenant scan", meta: "Tenant · 09/26 22:49" },
    { title: "Summons fields extracted (6/6)", meta: "System · 09/26 22:50" },
    { title: "DHCD lookup: no active license", meta: "System · 09/26 22:52" },
    { title: "Tenant shared case with Public Justice Center", meta: "Tenant · 09/26 22:55" },
    { title: "Assigned to J. Rivera", meta: "M. Chen · 09/27 08:14" },
  ],
};

/** Detail panels for a case. STD-2026-0412 matches the Figma frames; the rest are derived. */
export function getCaseDetail(c: AdvocateCase): CaseDetailData {
  if (c.reference === "STD-2026-0412") return detail0412;

  const filed = formatDate(c.filingDate, "long");
  const hearing = formatDate(c.hearingDate, "short");
  const results: Record<LicenseResult, CaseDetailData["result"]> = {
    no_license: {
      tone: "ok",
      text: `No license was active on the filing date (${filed}).`,
      mobileText: `No license active on the filing date (${filed}).`,
      recordsText: `No license active on the filing date (${filed}).`,
    },
    expired: {
      tone: "ok",
      text: `No license was active on the filing date (${filed}). The most recent license had expired.`,
      mobileText: `No license active on the filing date (${filed}).`,
      recordsText: `No license active on the filing date (${filed}).`,
    },
    active: {
      tone: "warn",
      text: `An active license was found for this address on the filing date (${filed}).`,
      mobileText: `Active license on the filing date (${filed}).`,
      recordsText: `Active license on the filing date (${filed}).`,
    },
    needs_review: {
      tone: "warn",
      text: "The address matched more than one DHCD record. Review the matches before relying on the result.",
      mobileText: "Address matched more than one DHCD record. Review the matches.",
      recordsText: "Address matched more than one DHCD record.",
    },
    could_not_verify: {
      tone: "danger",
      text: "The DHCD lookup timed out. Re-run the check before the hearing.",
      mobileText: "DHCD lookup timed out. Re-run the check.",
      recordsText: "DHCD lookup timed out.",
    },
  };

  const records: LicenseRecord[] =
    c.licenseResult === "active"
      ? [{ number: "RL-2025-130417", status: "Active", validFrom: "07/01/2025", validTo: "06/30/2027", source: "DHCD license lookup" }]
      : c.licenseResult === "expired"
        ? [{ number: "RL-2022-104556", status: "Expired", validFrom: "04/01/2022", validTo: "03/31/2024", source: "DHCD license lookup" }]
        : [];

  return {
    result: results[c.licenseResult],
    records,
    lookupMeta: detail0412.lookupMeta,
    nextActions: [
      { label: "License check completed", due: formatDate(c.createdAt, "monthDay"), done: c.licenseResult !== "could_not_verify" },
      { label: "Request DHCD certification", due: "Due 10/02", urgent: c.stage === "needs_certification" },
      { label: "Confirm documents with tenant", due: "Due 10/09" },
      { label: "Attend hearing · raise defense", due: hearing.slice(0, 5) },
    ],
    activity: [
      { title: "Case created from tenant scan", meta: "Tenant · 09/26 22:49" },
      { title: "Summons fields extracted (6/6)", meta: "System · 09/26 22:50" },
      ...(c.assignee ? [{ title: `Assigned to ${c.assignee}`, meta: "M. Chen · 09/27 08:14" }] : []),
    ],
  };
}

/* ---------------------------------------------------------------------------------------------- */
/* Formatting                                                                                       */

const TIME_ZONE = "America/New_York";

/**
 * - `short`: 10/13/26 (tables)
 * - `long`: 10/13/2026 (summons details)
 * - `monthDay`: 09/26
 * - `month`: Oct 13 (cards)
 */
export function formatDate(iso: string, style: "short" | "long" | "monthDay" | "month") {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00-04:00` : iso);
  const opts: Intl.DateTimeFormatOptions =
    style === "month"
      ? { month: "short", day: "numeric" }
      : style === "monthDay"
        ? { month: "2-digit", day: "2-digit" }
        : { month: "2-digit", day: "2-digit", year: style === "short" ? "2-digit" : "numeric" };
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: TIME_ZONE }).format(date);
}

/** "9:00 AM" */
export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}

/** "Tue" */
export function formatWeekday(iso: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TIME_ZONE }).format(new Date(iso));
}

/**
 * Whole days to the hearing. Frame 12m ("Hearing in 17 days" for Oct 13) counts from Sep 26,
 * the day the case came in, not from MOCK_TODAY.
 */
export function daysUntil(iso: string, from = "2026-09-26") {
  const today = Date.parse(`${from}T00:00:00-04:00`);
  const target = Date.parse(`${iso.slice(0, 10)}T00:00:00-04:00`);
  return Math.round((target - today) / 86_400_000);
}

/** "2417 E Monument St, Apt 2" from the full address (drops city, state and ZIP). */
export function shortAddress(address: string) {
  return address.split(", Baltimore")[0];
}
