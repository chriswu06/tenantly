import { Check, Circle, LoaderCircle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type VerificationStepState = "done" | "active" | "waiting";

const stateStyles: Record<VerificationStepState, { tile: string; icon: typeof Check; srLabel: string }> = {
  done: { tile: "bg-success-bg text-success-fg", icon: Check, srLabel: "Done" },
  active: { tile: "bg-accent-subtle text-accent", icon: LoaderCircle, srLabel: "In progress" },
  waiting: { tile: "bg-bg-subtle text-text-tertiary", icon: Circle, srLabel: "Waiting" },
};

type VerificationStepsProps = {
  steps: { label: string; detail: string; state: VerificationStepState }[];
  className?: string;
};

/**
 * DHCD lookup progress (frames 05 and 17). The detail sits under the label
 * on mobile and at the end of the row on web.
 */
export function VerificationSteps({ steps, className }: VerificationStepsProps) {
  return (
    <ol
      aria-label="Verification steps"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]",
        className,
      )}
    >
      {steps.map(({ label, detail, state }) => {
        const style = stateStyles[state];
        return (
          <li
            key={label}
            aria-current={state === "active" ? "step" : undefined}
            className="flex items-start gap-3 border-b border-border-default px-4 py-3.5 last:border-b-0 md:items-center"
          >
            <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-xl", style.tile)}>
              <Icon icon={style.icon} size={14} className={cn(state === "active" && "motion-safe:animate-spin")} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:gap-3">
              <span
                className={cn(
                  "text-14 leading-[1.3] md:min-w-0 md:flex-1 md:leading-[1.45]",
                  state === "active" ? "font-semibold" : "font-medium",
                  state === "waiting" ? "text-text-tertiary" : "text-text-primary",
                )}
              >
                {label}
                <span className="sr-only"> ({style.srLabel})</span>
              </span>
              <span
                className={cn(
                  "text-12 leading-[1.4] md:shrink-0 md:leading-[1.45]",
                  state === "active" ? "text-accent" : "text-text-tertiary",
                )}
              >
                {detail}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
