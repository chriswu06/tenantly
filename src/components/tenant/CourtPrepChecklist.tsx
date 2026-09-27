"use client";

import { startTransition, useOptimistic } from "react";
import { setChecklistItem } from "@/lib/cases/actions";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export type CourtPrepItem = {
  id: string;
  label: string;
  tag?: "required" | "optional";
  done: boolean;
};

type CourtPrepChecklistProps = {
  items: CourtPrepItem[];
  className?: string;
};

/**
 * "Documents" progress bar and checklist. Ticks save to the case right away and
 * show before the server confirms.
 *
 * @example <CourtPrepChecklist items={view.checklist} />
 */
export function CourtPrepChecklist({ items, className }: CourtPrepChecklistProps) {
  const [optimistic, setOptimistic] = useOptimistic(
    items,
    (current, change: { id: string; done: boolean }) =>
      current.map((item) => (item.id === change.id ? { ...item, done: change.done } : item)),
  );
  const done = new Set(optimistic.filter((item) => item.done).map((item) => item.id));
  const readyCount = done.size;

  function toggle(id: string, checked: boolean) {
    startTransition(async () => {
      setOptimistic({ id, done: checked });
      await setChecklistItem(id, checked);
    });
  }

  return (
    <section aria-labelledby="documents-heading" className={cn("flex flex-col gap-3.5 md:gap-5", className)}>
      <div className="flex flex-col gap-1.5 md:gap-2">
        <div className="flex items-start justify-between leading-[1.4] whitespace-nowrap md:leading-[1.45]">
          <h2 id="documents-heading" className="text-14 font-semibold text-text-primary">
            Documents
          </h2>
          <p className="text-13 text-text-secondary">
            {readyCount} of {items.length} ready
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Documents ready"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={readyCount}
          className="h-1.5 w-full overflow-hidden rounded-[3px] bg-bg-subtle"
        >
          <div
            className="h-full rounded-[3px] bg-success-fg transition-[width]"
            style={{ width: `${(readyCount / items.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]">
        {items.map((item) => {
          const checked = done.has(item.id);
          return (
            <li key={item.id} className="border-b border-border-default last:border-b-0">
              <Checkbox
                checked={checked}
                onChange={(event) => toggle(item.id, event.target.checked)}
                className="flex w-full cursor-pointer px-3.5 py-3 md:px-4 md:py-3.5 md:leading-[1.45]"
              >
                <span className={cn("min-w-0 flex-1", checked && "text-text-tertiary line-through")}>
                  {item.label}
                </span>
                {item.tag === "required" && (
                  <Badge tone="danger" className="md:py-0.5">
                    Required
                  </Badge>
                )}
                {item.tag === "optional" && (
                  <Badge tone="neutral" className="md:py-0.5">
                    Optional
                  </Badge>
                )}
              </Checkbox>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const skeletonLabelWidths = ["w-44", "w-60", "w-20", "w-32", "w-40", "w-48"];

/** Loading state for `CourtPrepChecklist`: the real heading, an empty progress track and placeholder rows. */
export function CourtPrepChecklistSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-3.5 md:gap-5", className)}>
      <div className="flex flex-col gap-1.5 md:gap-2">
        <div className="flex items-start justify-between leading-[1.4] whitespace-nowrap md:leading-[1.45]">
          <p className="text-14 font-semibold text-text-primary">Documents</p>
          <div className="flex h-[18.2px] items-center md:h-[18.85px]">
            <Skeleton className="h-3 w-[70px]" />
          </div>
        </div>
        <div className="h-1.5 w-full rounded-[3px] bg-bg-subtle" />
      </div>

      <ul className="overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]">
        {Array.from({ length: rows }, (_, index) => (
          <li
            key={index}
            className="flex items-center gap-3 border-b border-border-default px-3.5 py-3 last:border-b-0 md:px-4 md:py-3.5"
          >
            <Skeleton className="size-5 shrink-0 rounded-sm" />
            {/* The long second item wraps on mobile. */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-[19.6px] items-center md:h-[20.3px]">
                <Skeleton className={cn("h-3.5 max-w-full", skeletonLabelWidths[index % skeletonLabelWidths.length])} />
              </div>
              {index === 1 && (
                <div className="flex h-[19.6px] items-center md:hidden">
                  <Skeleton className="h-3.5 w-24" />
                </div>
              )}
            </div>
            {index % 4 === 1 && <Skeleton className="h-[22.4px] w-16 md:h-[20.4px]" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
