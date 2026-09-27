/*
 * Display formatting for case data. Everything is shown in Baltimore time,
 * whatever time zone the server runs in.
 */

const TZ = "America/New_York";

function parts(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...options }).formatToParts(new Date(iso));
}
function part(list: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return list.find((p) => p.type === type)?.value ?? "";
}

/** "2026-09-18" → "09/18/2026". Dates without a time are formatted without shifting days. */
export function formatDateOnly(date: string | null) {
  if (!date) return "";
  const [y, m, d] = date.slice(0, 10).split("-");
  return `${m}/${d}/${y}`;
}

/** "2026-09-18" → "09/18/26". */
export function formatDateOnlyShort(date: string | null) {
  if (!date) return "";
  const [y, m, d] = date.slice(0, 10).split("-");
  return `${m}/${d}/${y.slice(2)}`;
}

/** Hearing tile and lines, e.g. OCT / 13 / "Tue, Oct 13 · 9:00 AM". */
export function hearingParts(iso: string) {
  const p = parts(iso, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const weekday = part(p, "weekday");
  const month = part(p, "month");
  const day = part(p, "day");
  const time = `${part(p, "hour")}:${part(p, "minute")} ${part(p, "dayPeriod")}`;
  const arriveAt = new Date(new Date(iso).getTime() - 30 * 60_000).toISOString();
  const a = parts(arriveAt, { hour: "numeric", minute: "2-digit" });
  return {
    month: month.toUpperCase(),
    day,
    shortDate: `${month} ${day}`,
    dateTime: `${weekday}, ${month} ${day} · ${time}`,
    time,
    arrive: `Arrive ${part(a, "hour")}:${part(a, "minute")} ${part(a, "dayPeriod")}`,
  };
}

/** Whole days from today (Baltimore) until the hearing; never negative. */
export function daysUntil(iso: string, now = new Date()) {
  const day = (d: Date) => {
    const p = parts(d.toISOString(), { year: "numeric", month: "2-digit", day: "2-digit" });
    return Date.UTC(+part(p, "year"), +part(p, "month") - 1, +part(p, "day"));
  };
  return Math.max(0, Math.round((day(new Date(iso)) - day(now)) / 86_400_000));
}

/** "Sep 26, 2026, 10:52 PM". */
export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "09/26 22:49", as in the console's activity list. */
export function formatStamp(iso: string) {
  const p = parts(iso, { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${part(p, "month")}/${part(p, "day")} ${part(p, "hour")}:${part(p, "minute")}`;
}

/** ".ics" UTC stamp, e.g. "20261013T130000Z". */
export function icsStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Value for <input type="date"> from a date column. */
export function toDateInput(date: string | null) {
  return date ? date.slice(0, 10) : "";
}

/** Value for <input type="datetime-local"> in Baltimore time. */
export function toDateTimeInput(iso: string | null) {
  if (!iso) return "";
  const p = parts(iso, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${part(p, "year")}-${part(p, "month")}-${part(p, "day")}T${part(p, "hour")}:${part(p, "minute")}`;
}

/** "2026-10-13T09:00" typed in Baltimore time → ISO string with the right offset. */
export function fromDateTimeInput(local: string) {
  const [date, time = "09:00"] = local.split("T");
  // Try both US Eastern offsets and keep the one that round-trips.
  for (const offset of ["-04:00", "-05:00"]) {
    const iso = `${date}T${time}:00${offset}`;
    if (toDateTimeInput(iso) === `${date}T${time}`) return new Date(iso).toISOString();
  }
  return new Date(`${date}T${time}:00-05:00`).toISOString();
}

/** First line and the rest of a US address: "2417 E Monument St, Apt 2" / "Baltimore, MD 21205". */
export function splitAddress(address: string | null) {
  if (!address) return { street: "", cityLine: "" };
  const pieces = address.split(",").map((s) => s.trim());
  const cityIndex = pieces.findIndex((s, i) => i > 0 && /^[A-Za-z .'-]+$/.test(s) && !/^(apt|unit|#|suite|ste)\b/i.test(s));
  if (cityIndex <= 0) return { street: address, cityLine: "" };
  return { street: pieces.slice(0, cityIndex).join(", "), cityLine: pieces.slice(cityIndex).join(", ") };
}
