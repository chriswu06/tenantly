import {
  CaseDesktopView,
  CaseDetailShell,
  HearingCard,
  loadCase,
  NextActionsPanel,
  ResultStrip,
} from "@/components/advocate/CaseDetail";
import { getCaseDetail } from "@/lib/mock/advocate";

type CasePageProps = { params: Promise<{ caseId: string }> };

/** Case detail, Overview tab (Figma frames 12 desktop, 12m mobile). */
export default async function CaseOverviewPage({ params }: CasePageProps) {
  const caseData = loadCase((await params).caseId);
  const detail = getCaseDetail(caseData);

  return (
    <CaseDetailShell caseData={caseData} tab="overview">
      <div className="flex flex-col gap-3 lg:hidden">
        <ResultStrip result={detail.result} text={detail.result.mobileText} />
        <HearingCard caseData={caseData} />
        <NextActionsPanel actions={detail.nextActions} />
      </div>
      <CaseDesktopView caseData={caseData} detail={detail} />
    </CaseDetailShell>
  );
}
