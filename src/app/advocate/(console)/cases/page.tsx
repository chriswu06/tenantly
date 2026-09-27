import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CaseCards,
  CaseCardsSkeleton,
  caseFilterTabs,
  CaseSearch,
  CasesPageHeader,
  CasesTable,
  CasesTableSkeleton,
} from "@/components/advocate/CasesTable";
import type { TabItem } from "@/components/ui/Tabs";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { hrefWith, parsePage } from "@/components/advocate/display";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import {
  CASES_PER_PAGE,
  caseFilterCounts,
  getCaseMetrics,
  listCases,
  parseCaseFilter,
  type CaseFilter,
} from "@/lib/cases/queries";

export const metadata: Metadata = { title: "Cases" };

const CASES_HREF = "/advocate/cases";

/** `?q=` searches, `?filter=` narrows the list and `?page=` pages through it, 8 at a time. */
export default async function CasesPage({ searchParams }: PageProps<"/advocate/cases">) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const filter = parseCaseFilter(params.filter);
  const page = parsePage(params.page);
  const [metrics, counts] = await Promise.all([getCaseMetrics(), caseFilterCounts()]);
  const filterTabs = caseFilterTabs(filter, counts, q);

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Cases" }]} title="Cases" />
      <PageBody>
        <CasesPageHeader />
        <CaseSearch />

        <StatGrid>
          {metrics.map((m) => (
            <StatCard key={m.label} metric={m} />
          ))}
        </StatGrid>

        <Tabs items={filterTabs} label="Case filters" className="-mx-4 px-4 lg:hidden" />
        {/* A new search, filter or page streams in under a fresh skeleton. */}
        <Suspense
          key={`${q}|${filter}|${page}`}
          fallback={
            <>
              <CaseCardsSkeleton />
              <CasesTableSkeleton filterTabs={filterTabs} />
            </>
          }
        >
          <CaseResults q={q} filter={filter} page={page} filterTabs={filterTabs} />
        </Suspense>
      </PageBody>
    </>
  );
}

async function CaseResults({ q, filter, page, filterTabs }: { q: string; filter: CaseFilter; page: number; filterTabs: TabItem[] }) {
  const { cases, total, pageCount } = await listCases({ q, filter, page });
  // An empty list means "nothing matches" when a filter or search is on, "no cases yet" when neither is.
  const filtered = filter !== "all" || q !== "";
  const from = (page - 1) * CASES_PER_PAGE + 1;
  const base = { q, filter: filter === "all" ? undefined : filter };
  const pagination = {
    from,
    to: from + cases.length - 1,
    total,
    prevHref: page > 1 ? hrefWith(CASES_HREF, { ...base, page: page > 2 ? page - 1 : undefined }) : undefined,
    nextHref: page < pageCount ? hrefWith(CASES_HREF, { ...base, page: page + 1 }) : undefined,
  };

  return (
    <>
      <CaseCards cases={cases} filtered={filtered} query={q} pagination={pagination} />
      <CasesTable cases={cases} filterTabs={filterTabs} pagination={pagination} filtered={filtered} query={q} />
    </>
  );
}
