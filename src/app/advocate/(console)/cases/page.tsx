import { CaseCards, caseFilterTabs, CaseSearch, CasesPageHeader, CasesTable } from "@/components/advocate/CasesTable";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { advocateCases, caseFilters, caseMetrics, filterCases, parseCaseFilter } from "@/lib/mock/advocate";

type CasesPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

/** Cases list (Figma frames 11 desktop, 11m mobile). `?filter=` narrows the list. */
export default async function CasesPage({ searchParams }: CasesPageProps) {
  const filter = parseCaseFilter((await searchParams).filter);
  const cases = filterCases(advocateCases, filter);
  const active = caseFilters.find((f) => f.key === filter)!;
  // An empty list means "nothing matches" when a filter is on, "no cases yet" when it isn't.
  const filtered = filter !== "all";
  const filterTabs = caseFilterTabs(filter);

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Cases" }]} title="Cases" />
      <PageBody>
        <CasesPageHeader />
        <CaseSearch />

        <StatGrid>
          {caseMetrics.map((m) => (
            <StatCard key={m.label} metric={m} />
          ))}
        </StatGrid>

        <Tabs items={filterTabs} label="Case filters" className="-mx-4 px-4 lg:hidden" />
        <CaseCards cases={cases} filtered={filtered} />
        <CasesTable cases={cases} filterTabs={filterTabs} total={active.count} filtered={filtered} />
      </PageBody>
    </>
  );
}
