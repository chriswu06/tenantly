import type { Metadata } from "next";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { ImpactChart, OutcomeBars, ReportsPageHeader } from "@/components/advocate/ImpactChart";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { getReports } from "@/lib/cases/queries";

export const metadata: Metadata = { title: "Impact reports" };

export default async function ReportsPage() {
  const { reportMetrics, checksPerMonth, outcomesLast6Months, range } = await getReports();
  const responses = outcomesLast6Months.reduce((sum, o) => sum + o.count, 0);

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Impact reports" }]} title="Impact reports" />
      <PageBody>
        <ReportsPageHeader />

        <StatGrid>
          {reportMetrics.map((m) => (
            <StatCard key={m.label} metric={m} valueSize={26} mobileLayout="stacked" />
          ))}
        </StatGrid>

        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:gap-5">
          <div className="min-w-0 lg:flex-1">
            <ImpactChart data={checksPerMonth} />
          </div>
          <div className="lg:w-100 lg:shrink-0">
            <OutcomeBars
              outcomes={outcomesLast6Months}
              period={range}
              footnote={`From anonymous tenant reports. ${responses} ${responses === 1 ? "response" : "responses"}.`}
            />
          </div>
        </div>
      </PageBody>
    </>
  );
}
