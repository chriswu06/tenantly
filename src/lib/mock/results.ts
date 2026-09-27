import { getMockCase } from "@/lib/mock-data";
import { marylandLegalAid, publicJusticeCenter } from "@/lib/contacts";

/*
 * Mock data for lane B (results, next steps, sharing). Display strings are
 * typed as they appear in the Figma frames so pages don't depend on the
 * server's time zone when formatting dates.
 */

const mockCase = getMockCase();

export const resultsCase = {
  reference: mockCase.reference,
  caseNumber: mockCase.caseNumber,
  landlordName: mockCase.landlordName,
  court: mockCase.court,
  /** First line of the property address. */
  street: "2417 E Monument St, Apt 2",
  cityLine: "Baltimore, MD 21205",
  filingDate: "09/18/2026",
  hearing: {
    month: "OCT",
    day: "13",
    shortDate: "Oct 13",
    dateTime: "Tue, Oct 13 · 9:00 AM",
    arrive: "Arrive 8:30 AM",
    daysAway: 17,
    courtAddress: "501 E Fayette St",
    courtName: "District Court, 501 E Fayette St",
    /** For the .ics file. Eastern time, 9:00–12:00. */
    startUtc: "20261013T130000Z",
    endUtc: "20261013T160000Z",
  },
  checkedAt: "Sep 26, 2026, 10:52 PM",
} as const;

export type LicenseRecord = {
  number: string;
  status: "active" | "expired";
  validFrom: string;
  validTo: string;
  source: string;
};

export const licenseRecords: LicenseRecord[] = [
  { number: "RL-2023-118804", status: "expired", validFrom: "04/01/2023", validTo: "03/31/2025", source: "Baltimore City DHCD" },
  { number: "RL-2021-097132", status: "expired", validFrom: "04/01/2021", validTo: "03/31/2023", source: "Baltimore City DHCD" },
];

export const dhcdOffice = {
  name: "Property Registration & Licensing Division",
  address: "417 E Fayette St, Room 100",
  fullAddress: "417 E Fayette St, Room 100, Baltimore, MD",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=417+E+Fayette+St+Baltimore+MD+21202",
};

export const legalContacts = [marylandLegalAid, publicJusticeCenter];

export type LegalAidOrg = {
  id: string;
  name: string;
  /** Mobile subtitle. */
  short: string;
  /** Desktop subtitle. */
  detail: string;
};

export const legalAidOrgs: LegalAidOrg[] = [
  { id: "pjc", name: "Public Justice Center", short: "Tenant advocacy", detail: "Tenant advocacy · Responds by phone" },
  { id: "mla", name: "Maryland Legal Aid", short: "Income eligibility applies", detail: "Civil legal services · Income eligibility applies" },
  { id: "mvls", name: "Maryland Volunteer Lawyers Service", short: "Income eligibility applies", detail: "Volunteer attorneys · Income eligibility applies" },
];

export function findOrg(id: string | undefined): LegalAidOrg {
  return legalAidOrgs.find((org) => org.id === id) ?? legalAidOrgs[0];
}

export const tenantContact = {
  firstName: "Denise",
  phone: "(410) 555-0148",
};

export type ChecklistItem = {
  id: string;
  label: string;
  tag?: "required" | "optional";
  done: boolean;
};

export const courtChecklist: ChecklistItem[] = [
  { id: "summons", label: "Summons and complaint", done: true },
  { id: "certification", label: "DHCD certification or request receipt", tag: "required", done: false },
  { id: "photo-id", label: "Photo ID", done: true },
  { id: "lease", label: "Lease agreement", done: false },
  { id: "rent-records", label: "Rent payment records", done: false },
  { id: "repairs", label: "Repair photos or messages", tag: "optional", done: false },
];

export function hearingIcsHref() {
  const { hearing } = resultsCase;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Standing//EN",
    "BEGIN:VEVENT",
    `UID:${resultsCase.reference}@standing`,
    `DTSTART:${hearing.startUtc}`,
    `DTEND:${hearing.endUtc}`,
    "SUMMARY:Rent court hearing",
    `LOCATION:${hearing.courtName}, Baltimore, MD`,
    `DESCRIPTION:Case ${resultsCase.caseNumber}. Arrive by 8:30 AM.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
