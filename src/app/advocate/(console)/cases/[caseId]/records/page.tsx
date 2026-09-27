import { CaseDesktopView, CaseDetailShell, loadCase } from "@/components/advocate/CaseDetail";
import { RecordsTab } from "@/components/advocate/RecordsTab";
import { getCaseDetail } from "@/lib/mock/advocate";

type CasePageProps = { params: Promise<{ caseId: string }> };

/** Case detail, Records tab (Figma frame 52 on mobile, frame 12 on desktop). */
export default async function CaseRecordsPage({ params }: CasePageProps) {
  const caseData = loadCase((await params).caseId);
  const detail = getCaseDetail(caseData);
  return (
    <CaseDetailShell caseData={caseData} tab="records">
      <RecordsTab caseData={caseData} detail={detail} />
      <CaseDesktopView caseData={caseData} detail={detail} />
    </CaseDetailShell>
  );
}
