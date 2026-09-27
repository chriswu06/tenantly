export type CaseStage =
  | "needs_review"
  | "verifying"
  | "needs_certification"
  | "ready_for_court"
  | "closed";

export type LicenseStatus = "verified" | "no_license_found" | "unclear" | "not_checked";

export type OutcomeOption =
  | "raised_license_defense"
  | "case_dismissed"
  | "case_postponed"
  | "did_not_raise_defense"
  | "did_not_attend";

/** How sure the summons extraction is about a field; drives the badge on the review screen. */
export type FieldConfidence = "confirmed" | "needs_review" | "uncertain" | "missing";

export type ExtractedField<T> = {
  value: T;
  confidence: FieldConfidence;
};

export type Case = {
  id: string;
  /** Our tracking code, e.g. "STD-2026-0412". */
  reference: string;
  /** The court's docket number, e.g. "D-01-LT-26-004821". */
  caseNumber: string;
  stage: CaseStage;
  court: string;
  propertyAddress: string;
  landlordName: string;
  /** ISO date. */
  filingDate: string;
  /** ISO datetime with offset. */
  hearingDate: string;
  licenseNumberOnComplaint: string | null;
  licenseStatus: LicenseStatus;
  assignee: string | null;
  outcome: OutcomeOption | null;
  extracted: {
    propertyAddress: ExtractedField<string>;
    caseNumber: ExtractedField<string>;
    landlordName: ExtractedField<string>;
    hearingDate: ExtractedField<string>;
    filingDate: ExtractedField<string>;
    licenseNumberOnComplaint: ExtractedField<string | null>;
  };
  createdAt: string;
  updatedAt: string;
};
