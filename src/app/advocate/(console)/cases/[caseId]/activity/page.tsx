import type { Metadata } from "next";
import { ActivityTab } from "@/components/advocate/ActivityTab";
import { CaseDesktopView, CaseDetailShell } from "@/components/advocate/CaseDetail";
import { getCaseDetail } from "@/lib/cases/queries";

export async function generateMetadata({ params }: { params: Promise<{ caseId: string }> }): Promise<Metadata> {
  const { caseId } = await params;
  return { title: `Activity · ${decodeURIComponent(caseId)}` };
}

export default async function CaseActivityPage({ params }: PageProps<"/advocate/cases/[caseId]/activity">) {
  const { caseData, detail, certificationReceivedAt } = await getCaseDetail(decodeURIComponent((await params).caseId));
  return (
    <CaseDetailShell caseData={caseData} tab="activity" certificationRecorded={Boolean(certificationReceivedAt)}>
      <ActivityTab detail={detail} />
      <CaseDesktopView caseData={caseData} detail={detail} />
    </CaseDetailShell>
  );
}
