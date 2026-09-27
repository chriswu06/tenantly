import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { LookupsActions, LookupsPageHeader, LookupsTableSkeleton } from "@/components/advocate/LookupsTable";
import { StatGridSkeleton } from "@/components/advocate/StatCard";
import { lookupMetricLabels } from "@/components/advocate/display";

/** License lookups while they load: real header and actions; placeholder metrics and rows. */
export default function LookupsLoading() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "License lookups" }]} title="License lookups" />
      <LoadingPageBody label="Loading license lookups">
        <LookupsPageHeader />
        <StatGridSkeleton metrics={lookupMetricLabels} valueSize={24} mobileLayout="stacked" />
        <div className="flex gap-2 lg:hidden">
          <LookupsActions />
        </div>
        <LookupsTableSkeleton />
      </LoadingPageBody>
    </>
  );
}
