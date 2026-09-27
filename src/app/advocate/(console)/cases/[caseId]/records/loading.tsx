import {
  CaseDesktopViewSkeleton,
  CaseDetailLoadingShell,
  LicenseVerificationPanelSkeleton,
  SummonsPanelSkeleton,
} from "@/components/advocate/CaseDetail";

export default function CaseRecordsLoading() {
  return (
    <CaseDetailLoadingShell tab="records">
      <div className="flex flex-col gap-3 lg:hidden">
        <LicenseVerificationPanelSkeleton />
        <SummonsPanelSkeleton />
      </div>
      <CaseDesktopViewSkeleton />
    </CaseDetailLoadingShell>
  );
}
