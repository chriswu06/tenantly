import type { CSSProperties } from "react";
import type { OutcomeCount } from "@/lib/mock/advocate";
import { Panel, PanelHeader, PanelMeta } from "./ConsolePage";

type ChartMonth = { month: string; total: number; noLicense: number };

/**
 * "License checks per month" stacked columns (frames 60, 61), plain CSS.
 * Bar heights scale with the count: 0.6px per check on mobile, 0.8px on desktop.
 */
export function ImpactChart({ data }: { data: ChartMonth[] }) {
  return (
    <Panel>
      <PanelHeader title="License checks per month" aside={<PanelMeta>Stacked: no license found</PanelMeta>} />
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
        <figcaption className="flex flex-wrap gap-4 px-4 pb-3.5">
          <LegendItem className="bg-accent">No active license found</LegendItem>
          <LegendItem className="bg-accent-border">Other results</LegendItem>
        </figcaption>
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
