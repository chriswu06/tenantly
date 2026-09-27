import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { ImpactChartSkeleton, OutcomeBarsSkeleton, ReportsPageHeader } from "@/components/advocate/ImpactChart";
import { StatGridSkeleton } from "@/components/advocate/StatCard";
import { reportMetricLabels } from "@/components/advocate/display";

/** Impact reports while they load: real header and chart titles; placeholder metrics, bars and counts. */
export default function ReportsLoading() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Impact reports" }]} title="Impact reports" />
      <LoadingPageBody label="Loading impact reports">
        <ReportsPageHeader />
        <StatGridSkeleton metrics={reportMetricLabels} valueSize={26} mobileLayout="stacked" />
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:gap-5">
          <div className="min-w-0 lg:flex-1">
            <ImpactChartSkeleton />
          </div>
          <div className="lg:w-100 lg:shrink-0">
            <OutcomeBarsSkeleton period="Last 6 months" />
          </div>
        </div>
      </LoadingPageBody>
    </>
  );
}
