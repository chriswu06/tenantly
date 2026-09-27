import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export type NextStep = {
  href: string;
  icon: LucideIcon;
  label: string;
  /** Second line, shown on desktop only (Figma 18). */
  description?: string;
  /** Accent-colored row, e.g. "Share case with legal aid". */
  accent?: boolean;
  /** Row only appears in the mobile list; desktop shows it as its own card. */
  mobileOnly?: boolean;
};

type NextStepsProps = {
  steps: NextStep[];
  title?: string;
  className?: string;
};

/**
 * "Recommended next steps" link list (Figma 06 and 18).
 *
 * @example <NextSteps steps={[{ href: "/certification", icon: FileText, label: "Request DHCD certification" }]} />
 */
export function NextSteps({ steps, title = "Recommended next steps", className }: NextStepsProps) {
  const lastDesktopIndex = steps.findLastIndex((step) => !step.mobileOnly);
  return (
    <section
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]",
        className,
      )}
    >
      <h2 className="border-b border-border-default px-4 py-3 text-14 leading-[1.4] font-semibold text-text-primary md:flex md:h-12 md:items-center md:py-0 md:leading-[1.45]">
        {title}
      </h2>
      <ul>
        {steps.map((step, index) => (
          <li
            key={step.href}
            className={cn(
              "border-b border-border-default last:border-b-0",
              step.mobileOnly && "md:hidden",
              index === lastDesktopIndex && "md:border-b-0",
            )}
          >
            <Link
              href={step.href}
              className="flex items-center gap-3 px-4 py-[11px] hover:bg-bg-app md:py-3"
            >
              <Icon icon={step.icon} size={18} className={step.accent ? "text-accent" : "text-text-secondary"} />
              <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4] md:leading-[1.45]">
                <span className={cn("text-14 font-medium", step.accent ? "text-accent" : "text-text-primary")}>
                  {step.label}
                </span>
                {step.description && (
                  <span className="hidden text-12 text-text-tertiary md:block">{step.description}</span>
                )}
              </span>
              <Icon icon={ChevronRight} size={18} className="text-text-tertiary md:hidden" />
              <Icon icon={ChevronRight} size={16} className="hidden text-text-tertiary md:block" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Loading stand-in for `NextSteps`: the real heading over placeholder rows. */
export function NextStepsSkeleton({
  rows = 3,
  mobileRows = rows,
  title = "Recommended next steps",
  className,
}: {
  /** Rows from `md` up. */
  rows?: number;
  /** Rows on mobile, where mobile-only steps are included. */
  mobileRows?: number;
  title?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]",
        className,
      )}
    >
      <p className="border-b border-border-default px-4 py-3 text-14 leading-[1.4] font-semibold text-text-primary md:flex md:h-12 md:items-center md:py-0 md:leading-[1.45]">
        {title}
      </p>
      <ul>
        {Array.from({ length: Math.max(rows, mobileRows) }, (_, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center gap-3 border-border-default px-4 py-[11px] md:py-3",
              index < mobileRows - 1 && "border-b",
              index < rows - 1 ? "md:border-b" : "md:border-b-0",
              index >= mobileRows && "hidden md:flex",
              index >= rows && "md:hidden",
            )}
          >
            <Skeleton className="size-[18px] shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              {/* 14px label (21px line); 12px description (16.8px), md only. */}
              <div className="flex h-[21px] items-center">
                <Skeleton className={cn("h-3.5", index % 2 ? "w-44" : "w-52")} />
              </div>
              <div className="hidden h-[16.8px] items-center md:flex">
                <Skeleton className={cn("h-3", index % 2 ? "w-24" : "w-36")} />
              </div>
            </div>
            <Skeleton className="size-[18px] shrink-0 rounded-sm md:size-4" />
          </li>
        ))}
      </ul>
    </div>
  );
}
