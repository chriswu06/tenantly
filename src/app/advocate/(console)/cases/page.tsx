import { ChevronDown } from "lucide-react";
import { CaseCards, CaseSearch, CasesTable } from "@/components/advocate/CasesTable";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody, PageHeader } from "@/components/advocate/ConsolePage";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { Icon } from "@/components/ui/Icon";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { advocateCases, caseFilters, caseMetrics, filterCases, parseCaseFilter } from "@/lib/mock/advocate";

type CasesPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

/** Cases list (Figma frames 11 desktop, 11m mobile). `?filter=` narrows the list. */
export default async function CasesPage({ searchParams }: CasesPageProps) {
  const filter = parseCaseFilter((await searchParams).filter);
  const cases = filterCases(advocateCases, filter);
  const active = caseFilters.find((f) => f.key === filter)!;

  const filterTabs: TabItem[] = caseFilters.map((f) => ({
    href: f.key === "all" ? "/advocate/cases" : `/advocate/cases?filter=${f.key}`,
    label: f.label,
    shortLabel: f.shortLabel,
    count: f.count,
    active: f.key === filter,
  }));

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Cases" }]} title="Cases" />
      <PageBody>
        <PageHeader
          title="Cases"
          description="Tenants checked through Standing and referred to your organization."
          actions={
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-13 leading-[1.4] font-medium text-text-primary hover:bg-bg-subtle"
            >
              Last 30 days
              <Icon icon={ChevronDown} size={16} />
            </button>
          }
        />
        <CaseSearch />

        <StatGrid>
          {caseMetrics.map((m) => (
            <StatCard key={m.label} metric={m} />
          ))}
        </StatGrid>

        <Tabs items={filterTabs} label="Case filters" className="-mx-4 px-4 lg:hidden" />
        <CaseCards cases={cases} />
        <CasesTable cases={cases} filterTabs={filterTabs} total={active.count} />
      </PageBody>
    </>
  );
}
