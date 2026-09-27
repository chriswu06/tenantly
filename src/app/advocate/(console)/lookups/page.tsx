import Link from "next/link";
import { Download, Funnel } from "lucide-react";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody, PageHeader } from "@/components/advocate/ConsolePage";
import { LookupsTable } from "@/components/advocate/LookupsTable";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { lookupMetrics, lookups } from "@/lib/mock/advocate";
import { buttonClassName } from "@/components/ui/Button";

type LookupsPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

/** License lookup log (Figma frames 58 desktop, 59 mobile). `?filter=failed` shows failed lookups only. */
export default async function LookupsPage({ searchParams }: LookupsPageProps) {
  const failedOnly = (await searchParams).filter === "failed";
  const rows = failedOnly ? lookups.filter((l) => l.response === null) : lookups;

  const actions = (
    <>
      <Link
        href={failedOnly ? "/advocate/lookups" : "/advocate/lookups?filter=failed"}
        aria-current={failedOnly ? "page" : undefined}
        className={buttonClassName("secondary", "sm", cn(failedOnly && "border-text-primary bg-bg-subtle"))}
      >
        <Icon icon={Funnel} size={16} />
        Failed only
      </Link>
      <button type="button" className={buttonClassName("secondary", "sm")}>
        <Icon icon={Download} size={16} />
        Export CSV
      </button>
    </>
  );

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "License lookups" }]} title="License lookups" />
      <PageBody>
        <PageHeader
          title="License lookups"
          description="Every DHCD license check run for your organization’s cases."
          actions={actions}
        />
        <StatGrid>
          {lookupMetrics.map((m) => (
            <StatCard key={m.label} metric={m} valueSize={24} mobileLayout="stacked" />
          ))}
        </StatGrid>
        <div className="flex gap-2 lg:hidden">{actions}</div>
        <LookupsTable lookups={rows} />
      </PageBody>
    </>
  );
}
