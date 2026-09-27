import { ActivityPanelSkeleton, CaseDesktopViewSkeleton, CaseDetailLoadingShell } from "@/components/advocate/CaseDetail";

/** Case detail, Activity tab, while the case loads (frame 53 on mobile, frame 12 on desktop). */
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
