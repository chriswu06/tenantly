import { CaseDesktopViewSkeleton, CaseDetailLoadingShell, CaseOverviewSkeleton } from "@/components/advocate/CaseDetail";

export default function CaseOverviewLoading() {
  return (
    <CaseDetailLoadingShell tab="overview">
      <CaseOverviewSkeleton />
      <CaseDesktopViewSkeleton />
    </CaseDetailLoadingShell>
  );
}
