import { ActivityTab } from "@/components/advocate/ActivityTab";
import { CaseDesktopView, CaseDetailShell, loadCase } from "@/components/advocate/CaseDetail";
import { getCaseDetail } from "@/lib/mock/advocate";

type CasePageProps = { params: Promise<{ caseId: string }> };

/** Case detail, Activity tab (Figma frame 53 on mobile, frame 12 on desktop). */
export default async function CaseActivityPage({ params }: CasePageProps) {
  const caseData = loadCase((await params).caseId);
  const detail = getCaseDetail(caseData);
  return (
    <CaseDetailShell caseData={caseData} tab="activity">
      <ActivityTab detail={detail} />
      <CaseDesktopView caseData={caseData} detail={detail} />
    </CaseDetailShell>
  );
}
