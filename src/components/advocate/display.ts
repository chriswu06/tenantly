import type { BadgeTone } from "@/components/ui/Badge";
import type { LicenseResult, Metric } from "@/lib/cases/queries";

/*
 * Display helpers for the advocate console: status badges, date formatting and the
 * metric labels the loading states show before the numbers arrive.
 */

export const licenseResultBadge: Record<LicenseResult, { label: string; tone: BadgeTone }> = {
  // "No license" is the good outcome for the tenant (the defense applies), so it is green.
  no_license: { label: "No license found", tone: "ok" },
  expired: { label: "License expired", tone: "ok" },
  active: { label: "Active license", tone: "neutral" },
  needs_review: { label: "Needs review", tone: "warn" },
  could_not_verify: { label: "Could not verify", tone: "danger" },
  pending: { label: "Not checked", tone: "neutral" },
};

const TIME_ZONE = "America/New_York";

/** Dates without a time are pinned to noon in Baltimore so they never shift a day. */
function toDate(iso: string) {
  return new Date(iso.length === 10 ? `${iso}T12:00:00-04:00` : iso);
}

/**
 * - `short`: 10/13/26 (tables)
 * - `long`: 10/13/2026 (summons details)
 * - `month`: Oct 13 (cards)
 *
 * Empty dates show as an em dash.
 */
export function formatDate(iso: string | null | undefined, style: "short" | "long" | "month") {
  if (!iso) return "—";
  const opts: Intl.DateTimeFormatOptions =
    style === "month"
      ? { month: "short", day: "numeric" }
      : { month: "2-digit", day: "2-digit", year: style === "short" ? "2-digit" : "numeric" };
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: TIME_ZONE }).format(toDate(iso));
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

/** Whole calendar days (Baltimore time) from `now` to `iso`; negative once it has passed. */
export function daysFromToday(iso: string, now = new Date()) {
  const dayStart = (d: Date) => {
    const [m, day, y] = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(d)
      .split("/");
    return Date.UTC(+y, +m - 1, +day);
  };
  return Math.round((dayStart(new Date(iso)) - dayStart(now)) / 86_400_000);
}

/** "2417 E Monument St, Apt 2" from the full address (drops city, state and ZIP). */
export function shortAddress(address: string) {
  const pieces = address.split(",").map((s) => s.trim());
  const cityIndex = pieces.findIndex(
    (s, i) => i > 0 && /^[A-Za-z .'-]+$/.test(s) && !/^(apt|unit|#|suite|ste)\b/i.test(s),
  );
  return cityIndex > 0 ? pieces.slice(0, cityIndex).join(", ") : address;
}

/** "Good morning" / "Good afternoon" / "Good evening" and "Sunday, September 27", in Baltimore time. */
export function greetingFor(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: TIME_ZONE }).format(now),
  );
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: TIME_ZONE,
  }).format(now);
  return { greeting, date };
}

/** `base` with the given query parameters; empty values are left out. */
export function hrefWith(base: string, params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const query = qs.toString();
  return query ? `${base}?${query}` : base;
}

/** Page number from `?page=`, at least 1. */
export function parsePage(value: string | string[] | undefined) {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/* Metric labels for loading states. They match the labels the queries return. */

type MetricLabel = Pick<Metric, "label" | "shortLabel" | "note" | "shortNote">;

export const caseMetricLabels: MetricLabel[] = [
  { label: "License checks", note: "·", shortNote: "·" },
  { label: "No active license found", shortLabel: "No license found", note: "·", shortNote: "·" },
  { label: "Hearings this week", note: "·", shortNote: "·" },
  { label: "Defense raised (reported)", shortLabel: "Defense raised", note: "·", shortNote: "·" },
];

export const lookupMetricLabels: MetricLabel[] = [
  { label: "Lookups (7 days)", shortNote: "·" },
  { label: "Success rate", note: "·" },
  { label: "Median response", note: "·" },
];

export const reportMetricLabels: MetricLabel[] = [
  { label: "License checks", note: "·" },
  { label: "No active license found", note: "·" },
  { label: "Cases shared with legal aid", note: "·" },
  { label: "Defense raised (reported)", note: "·" },
];
