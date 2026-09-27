import { ChevronDown, Download } from "lucide-react";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody, PageHeader } from "@/components/advocate/ConsolePage";
import { ImpactChart, OutcomeBars } from "@/components/advocate/ImpactChart";
import { StatCard, StatGrid } from "@/components/advocate/StatCard";
import { Icon } from "@/components/ui/Icon";
import { checksPerMonth, outcomesLast6Months, reportMetrics } from "@/lib/mock/advocate";

function RangeButton() {
  return (
    <button
      type="button"
      className="flex h-9 items-center gap-2 rounded-md border border-border-strong bg-bg-surface px-3 text-13 leading-none font-medium text-text-primary hover:bg-bg-subtle"
    >
      Last 6 months
      <Icon icon={ChevronDown} size={16} />
    </button>
  );
}

/** Impact reports (Figma frames 60 desktop, 61 mobile). */
export default function ReportsPage() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Impact reports" }]} title="Impact reports" />
      <PageBody>
        <PageHeader
          title="Impact reports"
          description="How often tenants learn about and raise the license defense."
          actions={
            <>
              <RangeButton />
              <Button size="sm" leadingIcon={Download}>
                Export report
              </Button>
            </>
          }
        />
        <div className="flex gap-2 lg:hidden">
          <RangeButton />
          <button type="button" className={buttonClassName("secondary", "sm")}>
            <Icon icon={Download} size={16} />
            Export
          </button>
        </div>

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
