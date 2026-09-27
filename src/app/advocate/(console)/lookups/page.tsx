import type { Metadata } from "next";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { hrefWith, parsePage } from "@/components/advocate/display";
import { LookupsActions, LookupsPageHeader, LookupsTable } from "@/components/advocate/LookupsTable";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { getLookupMetrics, listLookups } from "@/lib/cases/queries";

export const metadata: Metadata = { title: "License lookups" };

const PER_PAGE = 10;

/**
 * License lookup log (Figma frames 58 desktop, 59 mobile).
 * `?filter=failed` shows failed lookups only; `?page=` pages through them, 10 at a time.
 */
export default async function LookupsPage({ searchParams }: PageProps<"/advocate/lookups">) {
  const params = await searchParams;
  const failedOnly = params.filter === "failed";
  const page = parsePage(params.page);
  const [metrics, { lookups, total, pageCount }] = await Promise.all([
    getLookupMetrics(),
    listLookups({ failedOnly, page }),
  ]);
  const filter = failedOnly ? "failed" : undefined;
  const from = (page - 1) * PER_PAGE + 1;

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "License lookups" }]} title="License lookups" />
      <PageBody>
        <LookupsPageHeader failedOnly={failedOnly} />
        <StatGrid>
          {metrics.map((m) => (
            <StatCard key={m.label} metric={m} valueSize={24} mobileLayout="stacked" />
          ))}
        </StatGrid>
        <div className="flex gap-2 lg:hidden">
          <LookupsActions failedOnly={failedOnly} />
        </div>
        <LookupsTable
          lookups={lookups}
          failedOnly={failedOnly}
          pagination={
            lookups.length > 0
              ? {
                  from,
                  to: from + lookups.length - 1,
                  total,
                  prevHref: page > 1 ? hrefWith("/advocate/lookups", { filter, page: page > 2 ? page - 1 : undefined }) : undefined,
                  nextHref: page < pageCount ? hrefWith("/advocate/lookups", { filter, page: page + 1 }) : undefined,
                }
              : undefined
          }
        />
      </PageBody>
    </>
  );
}
