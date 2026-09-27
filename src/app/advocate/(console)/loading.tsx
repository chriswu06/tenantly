import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { OutcomeBarsSkeleton } from "@/components/advocate/ImpactChart";
import { AttentionPanelSkeleton, HearingsPanelSkeleton, OverviewGreeting } from "@/components/advocate/OverviewPanels";
import { StatGridSkeleton } from "@/components/advocate/StatCard";
import { caseMetricLabels } from "@/components/advocate/display";

/** Advocate overview while it loads: real greeting and panel titles; placeholder metrics and rows. */
export default function OverviewLoading() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Overview" }]} title="Overview" />
      <LoadingPageBody label="Loading overview">
        <OverviewGreeting />
        <StatGridSkeleton metrics={caseMetricLabels} />
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:gap-5">
          {/* Mobile puts "Needs attention" first; desktop stacks it under the hearings. */}
          <div className="flex min-w-0 flex-col gap-3.5 lg:flex-1 lg:gap-5">
            <div className="order-2 lg:order-1">
              <HearingsPanelSkeleton />
            </div>
            <div className="order-1 lg:order-2">
              <AttentionPanelSkeleton />
            </div>
          </div>
          <div className="lg:w-100 lg:shrink-0">
            <OutcomeBarsSkeleton period="Last 30 days" />
          </div>
        </div>
      </LoadingPageBody>
    </>
  );
}
