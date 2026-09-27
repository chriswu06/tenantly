import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
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

/** Loading state for `HearingCard`: date tile, title and detail line placeholders. */
export function HearingCardSkeleton({
  lines = 1,
  withAction = false,
  className,
}: {
  /** Number of detail lines under the title. */
  lines?: number;
  /** Reserve the row under the card body, e.g. for the calendar link. */
  withAction?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-lg border border-border-default bg-bg-surface p-3.5 md:gap-3 md:rounded-[10px] md:p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-[51px] w-[46px] shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex h-[21px] items-center md:h-[20.3px]">
            <Skeleton className="h-4 w-36 md:h-3.5" />
          </div>
          {Array.from({ length: lines }, (_, index) => (
            <div key={index} className="flex h-[18.2px] items-center md:h-[17.4px]">
              <Skeleton className={cn("h-3 md:h-[11px]", index % 2 ? "w-2/5" : "w-4/5")} />
            </div>
          ))}
        </div>
      </div>
      {withAction && (
        <div className="flex h-[18.2px] items-center md:h-[18.85px]">
          <Skeleton className="h-3 w-36" />
        </div>
      )}
    </div>
  );
}
