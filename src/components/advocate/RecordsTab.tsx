import type { AdvocateCase, CaseDetailData } from "@/lib/mock/advocate";
import { LicenseVerificationPanel, SummonsPanel } from "./CaseDetail";

/** Records tab on mobile (frame 52): license verification and summons details. */
export function RecordsTab({ caseData, detail }: { caseData: AdvocateCase; detail: CaseDetailData }) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      <LicenseVerificationPanel detail={detail} />
      <SummonsPanel caseData={caseData} />
    </div>
  );
}
