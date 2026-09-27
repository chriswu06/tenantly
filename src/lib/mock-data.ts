import type { Case } from "@/types/case";

// Values match the STD-2026-0412 case shown in the Figma frames.
export const mockCase: Case = {
  id: "8f3c2a1e-4b6d-4e9a-9c7f-2d1b0a5e6f44",
  reference: "STD-2026-0412",
  caseNumber: "D-01-LT-26-004821",
  stage: "needs_certification",
  court: "District Court, 501 E Fayette St",
  propertyAddress: "2417 E Monument St, Apt 2, Baltimore, MD 21205",
  landlordName: "Harbor Point Rentals LLC",
  filingDate: "2026-09-18",
  hearingDate: "2026-10-13T09:00:00-04:00",
  licenseNumberOnComplaint: null,
  licenseStatus: "no_license_found",
  assignee: "J. Rivera",
  outcome: null,
  extracted: {
    propertyAddress: { value: "2417 E Monument St, Apt 2, Baltimore, MD 21205", confidence: "needs_review" },
    caseNumber: { value: "D-01-LT-26-004821", confidence: "confirmed" },
    landlordName: { value: "Harbor Point Rentals LLC", confidence: "confirmed" },
    hearingDate: { value: "2026-10-13T09:00:00-04:00", confidence: "confirmed" },
    filingDate: { value: "2026-09-18", confidence: "uncertain" },
    licenseNumberOnComplaint: { value: null, confidence: "missing" },
  },
  createdAt: "2026-09-26T14:32:00-04:00",
  updatedAt: "2026-09-26T14:35:00-04:00",
};

/** Returns a fresh copy so pages can mutate it without leaking state between renders. */
export function getMockCase(): Case {
  return structuredClone(mockCase);
}
