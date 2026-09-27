import {
  CaseDesktopViewSkeleton,
  CaseDetailLoadingShell,
  LicenseVerificationPanelSkeleton,
  SummonsPanelSkeleton,
} from "@/components/advocate/CaseDetail";

/** Case detail, Records tab, while the case loads (frame 52 on mobile, frame 12 on desktop). */
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
