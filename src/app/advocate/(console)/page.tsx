import type { Metadata } from "next";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { OutcomeBars } from "@/components/advocate/ImpactChart";
import { AttentionPanel, HearingsPanel, OverviewGreeting } from "@/components/advocate/OverviewPanels";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { getCaseMetrics, getOverview } from "@/lib/cases/queries";

export const metadata: Metadata = { title: "Overview" };

export default async function AdvocateOverviewPage() {
  const [metrics, { hearings, attention, outcomesLast30Days }] = await Promise.all([getCaseMetrics(), getOverview()]);
  const hearingsThisWeek = Number(metrics.find((m) => m.label === "Hearings this week")?.value ?? hearings.length);
  const responses = outcomesLast30Days.reduce((sum, o) => sum + o.count, 0);

  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Overview" }]} title="Overview" />
      <PageBody>
        <OverviewGreeting />

        <StatGrid>
          {metrics.map((m) => (
            <StatCard key={m.label} metric={m} />
          ))}
        </StatGrid>

        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:gap-5">
          {/* Mobile puts "Needs attention" first; desktop stacks it under the hearings. */}
          <div className="flex min-w-0 flex-col gap-3.5 lg:flex-1 lg:gap-5">
            <div className="order-2 lg:order-1">
              <HearingsPanel hearings={hearings} total={hearingsThisWeek} />
            </div>
            <div className="order-1 lg:order-2">
              <AttentionPanel items={attention} />
            </div>
          </div>
          <div className="lg:w-100 lg:shrink-0">
            <OutcomeBars
              outcomes={outcomesLast30Days}
              period="Last 30 days"
              footnote={`From anonymous tenant reports. ${responses} ${responses === 1 ? "response" : "responses"}.`}
            />
          </div>
        </div>
      </PageBody>
    </>
  );
}
