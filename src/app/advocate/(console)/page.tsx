import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { OutcomeBars } from "@/components/advocate/ImpactChart";
import { AttentionPanel, HearingsPanel } from "@/components/advocate/OverviewPanels";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { currentAdvocate } from "@/components/advocate/console-config";
import { caseMetrics, hearingsThisWeek, needsAttention, outcomesLast30Days } from "@/lib/mock/advocate";

/** Advocate console home (Figma frames 50 desktop, 51 mobile). */
export default function AdvocateOverviewPage() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Overview" }]} title="Overview" />
      <PageBody>
        <div className="flex flex-col gap-0.5 lg:gap-1">
          {/* The mobile app bar already has the page's <h1>. */}
          <p className="text-20 leading-[1.25] font-semibold text-text-primary lg:hidden">Good morning, Jordan</p>
          <h1 className="hidden text-24 font-semibold text-text-primary lg:block">Good morning, Jordan</h1>
          <p className="text-13 leading-[1.4] text-text-secondary lg:text-14">
            <span className="hidden lg:inline">{currentAdvocate.organization} · </span>Sunday, September 27
          </p>
        </div>

        <StatGrid>
          {caseMetrics.map((m) => (
            <StatCard key={m.label} metric={m} />
          ))}
        </StatGrid>

        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:gap-5">
          {/* Mobile puts "Needs attention" first; desktop stacks it under the hearings. */}
          <div className="flex min-w-0 flex-col gap-3.5 lg:flex-1 lg:gap-5">
            <div className="order-2 lg:order-1">
              <HearingsPanel hearings={hearingsThisWeek} total={23} />
            </div>
            <div className="order-1 lg:order-2">
              <AttentionPanel items={needsAttention} />
            </div>
          </div>
          <div className="lg:w-100 lg:shrink-0">
            <OutcomeBars
              outcomes={outcomesLast30Days}
              period="Last 30 days"
              footnote="From anonymous tenant reports. 71 responses."
              scaleMax={46}
            />
          </div>
        </div>
      </PageBody>
    </>
  );
}
