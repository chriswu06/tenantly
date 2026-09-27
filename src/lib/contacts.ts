/*
 * Real phone numbers and links shown to tenants. Keep them here so every page
 * agrees. Checked against each organization's own site on 2026-09-27.
 */

export type Contact = {
  name: string;
  /** As shown on screen. */
  phone: string;
  /** For `tel:` links. */
  tel: string;
};

/** Statewide intake line; mdlab.org says it reaches every regional office. */
export const marylandLegalAid: Contact = {
  name: "Maryland Legal Aid",
  phone: "888-465-2468",
  tel: "+18884652468",
};

export const publicJusticeCenter: Contact = {
  name: "Public Justice Center",
  phone: "410-625-9409",
  tel: "+14106259409",
};

/** Maryland Court Help Center, Mon–Fri 8:30 a.m.–8:00 p.m. (mdcourts.gov/helpcenter/mchc). */
export const courtHelpCenter: Contact = {
  name: "Maryland Court Help Center",
  phone: "410-260-1392",
  tel: "+14102601392",
};

export const peoplesLawLibraryUrl = "https://www.peoples-law.org/";

/** DHCD Property Registration and Rental Licensing (417 E Fayette St, Room 100). */
export const dhcdRentalLicensingUrl =
  "https://www.baltimorecity.gov/dhcd/our-work/permit-inspections/property-registration";
