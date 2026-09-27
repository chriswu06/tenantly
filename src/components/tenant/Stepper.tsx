import { cn } from "@/lib/utils";

export const TENANT_STEPS = ["Summons", "Review", "Verify", "Results"] as const;

type StepperProps = {
  /** Zero-based index of the current step. */
  current: number;
  steps?: readonly string[];
  className?: string;
};

/**
 * @example <Stepper current={1} />
 */
export function Stepper({ current, steps = TENANT_STEPS, className }: StepperProps) {
  return (
    <nav
      aria-label="Progress"
      className={cn("border-b border-border-default bg-bg-surface px-4 pt-3 pb-3.5", className)}
    >
      <ol className="flex items-start gap-2">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className="flex min-w-0 flex-1 flex-col gap-1.5"
            >
              <span
                aria-hidden
                className={cn("h-1 rounded-xs", isDone || isCurrent ? "bg-accent" : "bg-bg-subtle")}
              />
              <span
                className={cn(
                  "truncate text-12 leading-none",
                  isCurrent ? "font-semibold text-accent" : "font-medium",
                  isDone && "text-text-secondary",
                  !isDone && !isCurrent && "text-text-tertiary",
                )}
              >
                {index + 1}. {step}
                {isDone && <span className="sr-only"> (completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
