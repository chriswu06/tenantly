import { getMockCase } from "@/lib/mock-data";
import { courtHelpCenter, dhcdRentalLicensingUrl, marylandLegalAid, peoplesLawLibraryUrl } from "@/lib/contacts";

/*
 * Mock data for lane A (scan, verify and their edge states). Values match the
 * Figma frames 01–05, 13–17 and 31–38. Case values come from `getMockCase()`.
 */

export const uploadedFile = {
  name: "summons_page1.jpg",
  meta: "1 page · 2.4 MB",
};

export const oversizedFile = {
  name: "summons_scan.pdf",
  size: "14.2 MB",
};

export type FieldReadStatus = "found" | "reading" | "pending" | "unreadable";

export const extractionFields: { label: string; status: FieldReadStatus }[] = [
  { label: "Property address", status: "found" },
  { label: "Case number", status: "found" },
  { label: "Landlord (plaintiff)", status: "found" },
  { label: "Court date and time", status: "found" },
  { label: "Filing date", status: "reading" },
  { label: "License number on complaint", status: "pending" },
];

export const extractionProgress = { done: 4, total: 6 };

export const unreadableFields: { label: string; status: FieldReadStatus }[] = [
  { label: "Property address", status: "unreadable" },
  { label: "Case number", status: "found" },
  { label: "Landlord (plaintiff)", status: "found" },
  { label: "Court date and time", status: "unreadable" },
  { label: "Filing date", status: "unreadable" },
  { label: "License number on complaint", status: "unreadable" },
];

export const photoTips = [
  "Lay the page flat on a dark surface",
  "Use even light and avoid glare",
  "Fit the whole first page in the frame",
];

/** Extraction confidence shown next to each review field. */
export const reviewConfidence = {
  caseNumber: "98%",
  landlordName: "96%",
};

export type VerificationStepState = "done" | "active" | "waiting";

export const verificationSteps: { label: string; detail: string; state: VerificationStepState }[] = [
  { label: "Normalize address", detail: "Completed · 0.2s", state: "done" },
  { label: "Query DHCD license records", detail: "Completed · 1.8s", state: "done" },
  { label: "Match property records", detail: "3 candidate records", state: "active" },
  { label: "Compare license dates to filing date", detail: "Waiting", state: "waiting" },
];

export const normalizedAddress = "2417 E MONUMENT ST APT 2, BALTIMORE MD 21205";

/** Street only, for the guided check: the city lookup fails with unit numbers. */
export const lookupAddress = "2417 E MONUMENT ST";

// Guessed: the Figma file doesn't name the lookup URL.
export const cityLookupUrl = dhcdRentalLicensingUrl;

export const lastAttempt = "Last attempt 10:52 PM · DHCD records did not respond";

export const outsideAddress = {
  value: "8120 LIBERTY RD, WINDSOR MILL MD 21244",
  jurisdiction: "Baltimore County",
};

export const outsideAreaResources = [
  {
    name: "Maryland Legal Aid",
    detail: "Free civil legal help statewide",
    action: "call",
    href: `tel:${marylandLegalAid.tel}`,
  },
  {
    name: "Maryland People’s Law Library",
    detail: "Plain-language guides to landlord-tenant law",
    action: "open",
    href: peoplesLawLibraryUrl,
  },
  {
    name: "District Court Self-Help Center",
    detail: "Free help by phone or chat",
    action: "call",
    href: `tel:${courtHelpCenter.tel}`,
  },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Reads the wall-clock parts of an ISO string without shifting time zones. */
function parts(iso: string) {
  const [date, time = "00:00"] = iso.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, hour, minute, weekday };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function clock(hour: number, minute: number) {
  return `${hour % 12 || 12}:${pad(minute)} ${hour < 12 ? "AM" : "PM"}`;
}

/** "09/18/2026" */
export function formatInputDate(iso: string) {
  const { year, month, day } = parts(iso);
  return `${pad(month)}/${pad(day)}/${year}`;
}

/** "10/13/2026 · 9:00 AM" */
export function formatInputDateTime(iso: string) {
  const { hour, minute } = parts(iso);
  return `${formatInputDate(iso)} · ${clock(hour, minute)}`;
}

/** "Tue, Oct 13 · 9:00 AM" */
export function formatHearing(iso: string) {
  const { month, day, hour, minute, weekday } = parts(iso);
  return `${WEEKDAYS[weekday]}, ${MONTHS[month - 1]} ${day} · ${clock(hour, minute)}`;
}

/** "Sep 18, 2026" */
export function formatShortDate(iso: string) {
  const { year, month, day } = parts(iso);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** Month and day for the calendar tile: { month: "OCT", day: "13" }. */
export function calendarTile(iso: string) {
  const { month, day } = parts(iso);
  return { month: MONTHS[month - 1].toUpperCase(), day: String(day) };
}

/** Review form values for the STD-2026-0412 case. */
export function getReviewValues() {
  const mockCase = getMockCase();
  return {
    // The form shows the street line only: "2417 E Monument St, Apt 2".
    propertyAddress: mockCase.propertyAddress.split(", Baltimore")[0],
    caseNumber: mockCase.caseNumber,
    landlordName: mockCase.landlordName,
    filingDate: formatInputDate(mockCase.filingDate),
    hearingDate: formatInputDateTime(mockCase.hearingDate),
    licenseNumber: mockCase.licenseNumberOnComplaint ?? "",
  };
}
