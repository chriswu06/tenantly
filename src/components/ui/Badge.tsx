import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "ok" | "warn" | "danger" | "neutral" | "accent";

const toneClasses: Record<BadgeTone, string> = {
  ok: "border-success-border bg-success-bg text-success-fg",
  warn: "border-warning-border bg-warning-bg text-warning-fg",
  danger: "border-danger-border bg-danger-bg text-danger-fg",
  neutral: "border-neutral-border bg-neutral-bg text-neutral-fg",
  accent: "border-accent-border bg-accent-subtle text-accent",
};

type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: BadgeTone;
  /** Leading status dot, used for statuses (e.g. "Verify", "No license found"). */
  dot?: boolean;
};

/**
 * @example <Badge tone="warn" dot>Verify</Badge>
 */
export function Badge({ tone = "neutral", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.75 text-12 leading-[1.2] font-medium whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
