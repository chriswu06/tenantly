import type { Metadata } from "next";
import {
  caseActions,
  CaseDesktopView,
  CaseDetailShell,
  HearingCard,
  NextActionsPanel,
  ResultStrip,
} from "@/components/advocate/CaseDetail";
import { getCaseDetail } from "@/lib/cases/queries";

export async function generateMetadata({ params }: { params: Promise<{ caseId: string }> }): Promise<Metadata> {
  const { caseId } = await params;
  return { title: `${decodeURIComponent(caseId)}` };
}

/** Case detail, Overview tab (Figma frames 12 desktop, 12m mobile). */
export default async function CaseOverviewPage({ params }: PageProps<"/advocate/cases/[caseId]">) {
  const { caseData, detail, certificationReceivedAt } = await getCaseDetail(decodeURIComponent((await params).caseId));

  return (
    <CaseDetailShell caseData={caseData} tab="overview" certificationRecorded={Boolean(certificationReceivedAt)}>
      <div className="flex flex-col gap-3 lg:hidden">
        <ResultStrip result={detail.result} text={detail.result.mobileText} />
        <HearingCard caseData={caseData} />
        <NextActionsPanel actions={caseActions(caseData, detail.nextActions)} />
      </div>
      <CaseDesktopView caseData={caseData} detail={detail} />
    </CaseDetailShell>
  );
}
