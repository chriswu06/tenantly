import { ActivityPanelSkeleton, CaseDesktopViewSkeleton, CaseDetailLoadingShell } from "@/components/advocate/CaseDetail";

export default function CaseActivityLoading() {
  return (
    <CaseDetailLoadingShell tab="activity">
      <div className="lg:hidden">
        <ActivityPanelSkeleton />
      </div>
      <CaseDesktopViewSkeleton />
    </CaseDetailLoadingShell>
  );
}
