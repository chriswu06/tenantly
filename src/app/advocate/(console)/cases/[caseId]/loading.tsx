import { CaseDesktopViewSkeleton, CaseDetailLoadingShell, CaseOverviewSkeleton } from "@/components/advocate/CaseDetail";

/** Case detail, Overview tab, while the case loads (frames 12, 12m layout). */
export default function CaseOverviewLoading() {
  return (
    <CaseDetailLoadingShell tab="overview">
      <CaseOverviewSkeleton />
      <CaseDesktopViewSkeleton />
    </CaseDetailLoadingShell>
  );
}
