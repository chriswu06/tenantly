"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
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
 * "Documents" progress bar and checklist (Figma 08 and 20). State is local only.
 *
 * @example <CourtPrepChecklist items={courtChecklist} />
 */
export function CourtPrepChecklist({ items, className }: CourtPrepChecklistProps) {
  const [done, setDone] = useState(() => new Set(items.filter((item) => item.done).map((item) => item.id)));
  const readyCount = items.filter((item) => done.has(item.id)).length;

  function toggle(id: string, checked: boolean) {
    setDone((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
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
