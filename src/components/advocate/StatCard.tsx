import { cn } from "@/lib/utils";
import type { Metric } from "@/lib/mock/advocate";

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

/** Metric tile. Mobile: 12px padding, 22px value. Desktop: 16px padding. */
export function StatCard({ metric, valueSize = 28, mobileLayout = "inline" }: StatCardProps) {
  const { label, shortLabel, value, note, shortNote, tone = "muted" } = metric;
  const mobileNote = shortNote ?? note;
  const inline = mobileLayout === "inline";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-0.5 rounded-lg border border-border-default bg-bg-surface p-3 lg:flex-1 lg:p-4",
        valueSize === 28 ? "lg:gap-1.5" : "lg:gap-1",
      )}
    >
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
      <div className={cn(inline && "flex items-end gap-1.5 whitespace-nowrap lg:block")}>
        <p
          className={cn(
            "text-22 leading-[1.2] font-semibold text-text-primary",
            valueSize === 28 && "lg:leading-[1.15]",
            valueClass[valueSize],
          )}
        >
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
