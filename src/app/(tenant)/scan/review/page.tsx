import type { Metadata } from "next";
import type { FieldConfidence, FieldName } from "@/components/tenant/ExtractedFieldsForm";
import { ReviewScreen } from "@/components/tenant/scan/ReviewScreen";
import { toDateInput, toDateTimeInput } from "@/lib/cases/format";
import { requireTenantCase } from "@/lib/cases/session";

export const metadata: Metadata = { title: "Review your summons details", robots: { index: false, follow: false } };

type Extracted = Partial<Record<FieldName, { value: string | null; confidence: FieldConfidence }>>;

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ read?: string }> }) {
  const [row, { read }] = await Promise.all([requireTenantCase(), searchParams]);
  // `extracted` is {} until a summons has been read.
  const extracted = row.extracted && Object.keys(row.extracted).length ? (row.extracted as Extracted) : null;

  const confidence: Partial<Record<FieldName, FieldConfidence>> = {};
  for (const [name, field] of Object.entries(extracted ?? {}) as [FieldName, { confidence: FieldConfidence }][]) {
    if (field?.confidence) confidence[name] = field.confidence;
  }

  return (
    <ReviewScreen
      // Remount with fresh values if the case changes under the same URL.
      key={row.id}
      source={extracted ? "read" : read === "unavailable" ? "unavailable" : "manual"}
      confidence={confidence}
      values={{
        propertyAddress: row.property_address ?? "",
        caseNumber: row.case_number ?? "",
        landlordName: row.landlord_name ?? "",
        filingDate: toDateInput(row.filing_date),
        hearingDate: toDateTimeInput(row.hearing_at),
        licenseNumberOnComplaint: row.license_number_on_complaint ?? "",
      }}
    />
  );
}
