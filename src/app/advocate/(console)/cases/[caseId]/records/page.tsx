import type { Metadata } from "next";
import { CaseDesktopView, CaseDetailShell } from "@/components/advocate/CaseDetail";
import { RecordsTab } from "@/components/advocate/RecordsTab";
import { getCaseDetail } from "@/lib/cases/queries";

export async function generateMetadata({ params }: { params: Promise<{ caseId: string }> }): Promise<Metadata> {
  const { caseId } = await params;
  return { title: `Records · ${decodeURIComponent(caseId)}` };
}

export default async function CaseRecordsPage({ params }: PageProps<"/advocate/cases/[caseId]/records">) {
  const { caseData, detail, certificationReceivedAt } = await getCaseDetail(decodeURIComponent((await params).caseId));
  return (
    <CaseDetailShell caseData={caseData} tab="records" certificationRecorded={Boolean(certificationReceivedAt)}>
      <RecordsTab caseData={caseData} detail={detail} />
      <CaseDesktopView caseData={caseData} detail={detail} />
    </CaseDetailShell>
  );
}
