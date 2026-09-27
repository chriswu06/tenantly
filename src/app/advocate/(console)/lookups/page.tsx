import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { LookupsActions, LookupsPageHeader, LookupsTable } from "@/components/advocate/LookupsTable";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { lookupMetrics, lookups } from "@/lib/mock/advocate";

type LookupsPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

/** License lookup log (Figma frames 58 desktop, 59 mobile). `?filter=failed` shows failed lookups only. */
export default async function LookupsPage({ searchParams }: LookupsPageProps) {
  const failedOnly = (await searchParams).filter === "failed";
  const rows = failedOnly ? lookups.filter((l) => l.response === null) : lookups;

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "License lookups" }]} title="License lookups" />
      <PageBody>
        <LookupsPageHeader failedOnly={failedOnly} />
        <StatGrid>
          {lookupMetrics.map((m) => (
            <StatCard key={m.label} metric={m} valueSize={24} mobileLayout="stacked" />
          ))}
        </StatGrid>
        <div className="flex gap-2 lg:hidden">
          <LookupsActions failedOnly={failedOnly} />
        </div>
        <LookupsTable lookups={rows} failedOnly={failedOnly} />
      </PageBody>
    </>
  );
}
