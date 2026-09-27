import { cn } from "@/lib/utils";
import type { Metric } from "@/lib/cases/queries";
import { LineSkeleton } from "./ConsolePage";

const toneClass = {
  ok: "font-medium text-success-fg",
  warn: "font-medium text-warning-fg",
  muted: "text-text-tertiary",
} as const;

/** Desktop value size: 28 (Overview, Cases), 26 (Impact reports), 24 (License lookups). */
type ValueSize = 24 | 26 | 28;

const valueClass: Record<ValueSize, string> = {
  24: "lg:text-24",
  26: "lg:text-26",
  28: "lg:text-28",
};

type StatCardProps = {
  metric: Metric;
  valueSize?: ValueSize;
  /**
   * Mobile layout. `inline` puts the note next to the value ("142 +18%", frames 11m, 51);
   * `stacked` keeps it on its own line (frames 59, 61).
   */
  mobileLayout?: "inline" | "stacked";
};

function cardClass(valueSize: ValueSize) {
  return cn(
    "flex min-w-0 flex-col gap-0.5 rounded-lg border border-border-default bg-bg-surface p-3 lg:flex-1 lg:p-4",
    valueSize === 28 ? "lg:gap-1.5" : "lg:gap-1",
  );
}

function valueTextClass(valueSize: ValueSize) {
  return cn("text-22 leading-[1.2]", valueSize === 28 && "lg:leading-[1.15]", valueClass[valueSize]);
}

function StatLabel({ label, shortLabel }: Pick<Metric, "label" | "shortLabel">) {
  return (
    <p className="text-12 leading-[1.4] font-medium text-text-secondary lg:text-13">
      {shortLabel ? (
        <>
          <span className="lg:hidden">{shortLabel}</span>
          <span className="hidden lg:inline">{label}</span>
        </>
      ) : (
        label
      )}
    </p>
  );
}

/** Metric tile. Mobile: 12px padding, 22px value. Desktop: 16px padding. */
export function StatCard({ metric, valueSize = 28, mobileLayout = "inline" }: StatCardProps) {
  const { label, shortLabel, value, note, shortNote, tone = "muted" } = metric;
  const mobileNote = shortNote ?? note;
  const inline = mobileLayout === "inline";

  return (
    <div className={cardClass(valueSize)}>
      <StatLabel label={label} shortLabel={shortLabel} />
      <div className={cn(inline && "flex items-end gap-1.5 whitespace-nowrap lg:block")}>
        <p className={cn(valueTextClass(valueSize), "font-semibold text-text-primary")}>
          {value}
        </p>
        {inline && mobileNote && (
          <p className={cn("text-12 leading-[1.8] lg:hidden", toneClass[tone])}>{mobileNote}</p>
        )}
      </div>
      {!inline && mobileNote && (
        <p
          className={cn(
            "text-12 leading-[1.4] lg:hidden",
            valueSize === 26 && "text-11",
            toneClass[tone],
            !note && "font-medium",
          )}
        >
          {mobileNote}
        </p>
      )}
      {note && <p className={cn("hidden text-12 leading-[1.4] lg:block", toneClass[tone])}>{note}</p>}
    </div>
  );
}

/** Row of metrics: 2-column grid on mobile (10px gap), one row on desktop (16px gap). */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 items-start gap-2.5 lg:flex lg:gap-4">{children}</div>;
}

type StatCardSkeletonProps = Omit<StatCardProps, "metric"> & {
  /** The metric's labels are shown as they are; `note` and `shortNote` only say whether a note line is expected. */
  metric: Pick<Metric, "label" | "shortLabel" | "note" | "shortNote">;
};

/** Loading tile: the real label, with placeholders for the value and note. */
export function StatCardSkeleton({ metric, valueSize = 28, mobileLayout = "inline" }: StatCardSkeletonProps) {
  const { label, shortLabel, note, shortNote } = metric;
  const mobileNote = Boolean(shortNote ?? note);
  const inline = mobileLayout === "inline";

  return (
    <div className={cardClass(valueSize)}>
      <StatLabel label={label} shortLabel={shortLabel} />
      <div className={cn(inline && "flex items-end gap-1.5 lg:block")}>
        <LineSkeleton className={cn(valueTextClass(valueSize), "w-12 lg:w-16")} />
        {inline && mobileNote && <LineSkeleton className="w-9 text-12 leading-[1.8] lg:hidden" />}
      </div>
      {!inline && mobileNote && (
        <LineSkeleton className={cn("w-16 text-12 leading-[1.4] lg:hidden", valueSize === 26 && "text-11")} />
      )}
      {note && <LineSkeleton className="hidden w-3/5 text-12 leading-[1.4] lg:flex" />}
    </div>
  );
}

/** Loading row of metrics. Pass the page's metrics for their labels. */
export function StatGridSkeleton({ metrics, ...props }: Omit<StatCardSkeletonProps, "metric"> & { metrics: StatCardSkeletonProps["metric"][] }) {
  return (
    <StatGrid>
      {metrics.map((m) => (
        <StatCardSkeleton key={m.label} metric={m} {...props} />
      ))}
    </StatGrid>
  );
}
