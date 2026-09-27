import type { CSSProperties } from "react";
import { ChevronDown, Download } from "lucide-react";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OutcomeCount } from "@/lib/mock/advocate";
import { LineSkeleton, PageHeader, Panel, PanelHeader, PanelMeta } from "./ConsolePage";

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

/** Impact reports title and actions: page header on desktop (frame 60), a row of buttons on mobile (frame 61). */
export function ReportsPageHeader() {
  return (
    <>
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
    </>
  );
}

type ChartMonth = { month: string; total: number; noLicense: number };

/**
 * "License checks per month" stacked columns (frames 60, 61), plain CSS.
 * Bar heights scale with the count: 0.6px per check on mobile, 0.8px on desktop.
 */
export function ImpactChart({ data }: { data: ChartMonth[] }) {
  return (
    <Panel>
      <ImpactChartHeader />
      <figure className="m-0">
        <div
          className="flex items-end justify-between px-4 pt-4 pb-3 [--bar-scale:0.6px] lg:[--bar-scale:0.8px]"
          role="img"
          aria-label={`License checks per month: ${data
            .map((d) => `${d.month} ${d.total}, ${d.noLicense} with no active license found`)
            .join("; ")}.`}
        >
          {data.map((d) => (
            <div key={d.month} aria-hidden className="flex flex-col items-center gap-1.5">
              <span className="text-11 leading-[1.4] font-medium text-text-secondary">{d.total}</span>
              <span className="flex w-7.5 flex-col lg:w-14">
                <span
                  className="rounded-t-[3px] bg-accent-border"
                  style={{ height: `calc(${d.total - d.noLicense} * var(--bar-scale))` } as CSSProperties}
                />
                <span className="bg-accent" style={{ height: `calc(${d.noLicense} * var(--bar-scale))` }} />
              </span>
              <span className="text-12 leading-[1.4] text-text-tertiary">{d.month}</span>
            </div>
          ))}
        </div>
        <ImpactChartLegend />
      </figure>
    </Panel>
  );
}

function ImpactChartHeader() {
  return <PanelHeader title="License checks per month" aside={<PanelMeta>Stacked: no license found</PanelMeta>} />;
}

function ImpactChartLegend() {
  return (
    <figcaption className="flex flex-wrap gap-4 px-4 pb-3.5">
      <LegendItem className="bg-accent">No active license found</LegendItem>
      <LegendItem className="bg-accent-border">Other results</LegendItem>
    </figcaption>
  );
}

/** Stand-in column heights, in checks (scaled like the real bars). */
const skeletonColumns = [70, 100, 125, 150, 180, 200];

/** Loading chart: real title and legend, grey columns in place of the bars and labels. */
export function ImpactChartSkeleton() {
  return (
    <Panel>
      <ImpactChartHeader />
      <figure className="m-0">
        <div className="flex items-end justify-between px-4 pt-4 pb-3 [--bar-scale:0.6px] lg:[--bar-scale:0.8px]">
          {skeletonColumns.map((count, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <LineSkeleton className="w-5 text-11 leading-[1.4]" />
              <Skeleton
                className="w-7.5 rounded-none rounded-t-[3px] lg:w-14"
                style={{ height: `calc(${count} * var(--bar-scale))` }}
              />
              <LineSkeleton className="w-6 text-12 leading-[1.4]" />
            </div>
          ))}
        </div>
        <ImpactChartLegend />
      </figure>
    </Panel>
  );
}

function LegendItem({ className, children }: { className: string; children: string }) {
  return (
    <span className="flex items-center gap-1.5 text-12 leading-[1.4] text-text-secondary">
      <span aria-hidden className={`size-2.5 rounded-[2px] ${className}`} />
      {children}
    </span>
  );
}

type OutcomeBarsProps = {
  outcomes: OutcomeCount[];
  period: string;
  footnote: string;
  /** Count that fills the whole track. Defaults to the largest count. */
  scaleMax?: number;
};

/** "Reported outcomes" horizontal bars (frames 50, 60). Bars are relative to the largest count. */
export function OutcomeBars({ outcomes, period, footnote, scaleMax }: OutcomeBarsProps) {
  const max = scaleMax ?? Math.max(...outcomes.map((o) => o.count));
  return (
    <Panel>
      <PanelHeader title="Reported outcomes" aside={<PanelMeta>{period}</PanelMeta>} />
      <div className="flex flex-col gap-3 p-4">
        <dl className="flex flex-col gap-3">
          {outcomes.map((o) => (
            <div key={o.label} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2 text-13 leading-[1.4]">
                <dt className="text-text-secondary">{o.label}</dt>
                <dd className="font-semibold text-text-primary">{o.count}</dd>
              </div>
              <div aria-hidden className="h-2 overflow-hidden rounded-[3px] bg-bg-subtle">
                <div className="h-full rounded-[3px] bg-accent" style={{ width: `${(o.count / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </dl>
        <p className="text-12 leading-[1.4] text-text-tertiary">{footnote}</p>
      </div>
    </Panel>
  );
}

/** Loading "Reported outcomes": the real title and period, placeholder rows and footnote. */
export function OutcomeBarsSkeleton({ period, rows = 5 }: { period: string; rows?: number }) {
  const widths = ["w-44", "w-28", "w-32", "w-40", "w-24"];
  return (
    <Panel>
      <PanelHeader title="Reported outcomes" aside={<PanelMeta>{period}</PanelMeta>} />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2 text-13 leading-[1.4]">
                <LineSkeleton className={widths[i % widths.length]} />
                <LineSkeleton className="w-5" />
              </div>
              <Skeleton className="h-2 rounded-[3px]" />
            </div>
          ))}
        </div>
        <LineSkeleton className="w-56 max-w-full text-12 leading-[1.4]" />
      </div>
    </Panel>
  );
}
