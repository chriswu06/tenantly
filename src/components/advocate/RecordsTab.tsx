import type { AdvocateCase, CaseDetailData } from "@/lib/cases/queries";
import { LicenseVerificationPanel, SummonsPanel } from "./CaseDetail";

/** Records tab on mobile: license verification and summons details. */
export function RecordsTab({ caseData, detail }: { caseData: AdvocateCase; detail: CaseDetailData }) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      <LicenseVerificationPanel reference={caseData.reference} detail={detail} />
      <SummonsPanel caseData={caseData} />
    </div>
  );
}
