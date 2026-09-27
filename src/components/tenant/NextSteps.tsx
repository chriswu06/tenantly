import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
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
