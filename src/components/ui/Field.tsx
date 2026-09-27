import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type FieldProps = Omit<ComponentPropsWithRef<"input">, "children"> & {
  label: string;
  /** Shown at the end of the label row, e.g. an extraction confidence <Badge>. */
  badge?: ReactNode;
  hint?: ReactNode;
  /** Low-confidence value the tenant should double-check. */
  warning?: ReactNode;
  /** Validation error; takes precedence over `warning` and `hint`. */
  error?: ReactNode;
  trailingIcon?: LucideIcon;
};

/**
 * Labelled text input. `className` applies to the outer wrapper; other props go to the <input>.
 *
 * @example <Field label="Property address" badge={<Badge tone="warn" dot>Verify</Badge>} warning="Confirm the unit number." trailingIcon={MapPin} />
 */
export function Field({
  label,
  badge,
  hint,
  warning,
  error,
  trailingIcon,
  id,
  className,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? warning ?? hint;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-13 font-medium text-text-secondary">
          {label}
        </label>
        {badge}
      </div>
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border bg-bg-surface px-3",
          "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
          "has-disabled:bg-bg-subtle",
          error
            ? "border-[1.5px] border-danger-fg"
            : warning
              ? "border-[1.5px] border-warning-fg"
              : "border-border-strong",
        )}
      >
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-15 leading-none text-text-primary placeholder:text-text-tertiary focus-visible:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {trailingIcon && <Icon icon={trailingIcon} size={16} className="text-text-tertiary" />}
      </div>
      {message && (
        <p
          id={messageId}
          className={cn(
            "text-12",
            error ? "text-danger-fg" : warning ? "text-warning-fg" : "text-text-tertiary",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
