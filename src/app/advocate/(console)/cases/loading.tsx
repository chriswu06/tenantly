import { CaseCardsSkeleton, caseFilterTabs, CaseSearch, CasesPageHeader, CasesTableSkeleton } from "@/components/advocate/CasesTable";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { StatGridSkeleton } from "@/components/advocate/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { caseMetrics } from "@/lib/mock/advocate";

/** Cases list while it loads: real header, search and filter labels; placeholder metrics, cards and rows. */
export default function CasesLoading() {
  const filterTabs = caseFilterTabs();
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Cases" }]} title="Cases" />
      <LoadingPageBody label="Loading cases">
        <CasesPageHeader />
        <CaseSearch />
        <StatGridSkeleton metrics={caseMetrics} />
        <Tabs items={filterTabs} label="Case filters" className="-mx-4 px-4 lg:hidden" />
        <CaseCardsSkeleton />
        <CasesTableSkeleton filterTabs={filterTabs} />
      </LoadingPageBody>
    </>
  );
}
