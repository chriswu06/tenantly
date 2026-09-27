import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Accent "OCT 13" tile. */
export function DateTile({ month, day }: { month: string; day: string }) {
  return (
    <div
      aria-hidden
      className="flex shrink-0 flex-col items-center rounded-lg border border-accent-border bg-accent-subtle px-2.5 py-1.5 font-semibold whitespace-nowrap text-accent"
    >
      <span className="text-11 leading-[1.2] tracking-[0.44px]">{month}</span>
      <span className="text-22 leading-[1.1] tracking-normal">{day}</span>
    </div>
  );
}

type HearingCardProps = {
  month: string;
  day: string;
  title: ReactNode;
  /** One line per entry. */
  lines: ReactNode[];
  /** Extra content under the row, e.g. the calendar link. */
  children?: ReactNode;
  className?: string;
};

/** Hearing date card: date tile, title and detail lines. */
export function HearingCard({ month, day, title, lines, children, className }: HearingCardProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-lg border border-border-default bg-bg-surface p-3.5 md:gap-3 md:rounded-[10px] md:p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <DateTile month={month} day={day} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4] md:leading-[1.45]">
          <h2 className="text-15 font-semibold text-text-primary md:text-14">{title}</h2>
          {lines.map((line, index) => (
            <p key={index} className="text-13 text-text-secondary md:text-12">
              {line}
            </p>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}
