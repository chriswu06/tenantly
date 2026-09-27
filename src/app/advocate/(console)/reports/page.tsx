import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { ImpactChart, OutcomeBars, ReportsPageHeader } from "@/components/advocate/ImpactChart";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { checksPerMonth, outcomesLast6Months, reportMetrics } from "@/lib/mock/advocate";

/** Impact reports (Figma frames 60 desktop, 61 mobile). */
export default function ReportsPage() {
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
              period="Last 6 months"
              footnote="From anonymous tenant reports. 212 responses."
            />
          </div>
        </div>
      </PageBody>
    </>
  );
}
