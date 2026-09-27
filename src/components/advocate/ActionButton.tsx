"use client";

import { useState, useTransition, type ReactNode } from "react";
import { FileText, RefreshCw, UserPlus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

// Icons by name: components can't be passed from Server Components to this Client Component.
const icons = { file: FileText, refresh: RefreshCw, "user-plus": UserPlus } satisfies Record<string, LucideIcon>;

type ActionButtonProps = {
  /** A Server Action with its arguments bound, e.g. `assignToMe.bind(null, reference)`. */
  action: () => Promise<void>;
  children: ReactNode;
  /** Announced while the action runs, e.g. "Assigning…". */
  pendingLabel: string;
  /** Message shown if the action fails. */
  errorLabel?: string;
  icon?: keyof typeof icons;
  variant?: "primary" | "secondary" | "link";
  size?: "xs" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

/**
 * Button that runs a Server Action, with a spinner while it's pending and a short
 * error message (announced) if it fails. `link` renders as small accent text.
 */
export function ActionButton({
  action,
  children,
  pendingLabel,
  errorLabel = "That didn’t work. Try again.",
  icon,
  variant = "secondary",
  size = "sm",
  className,
  disabled,
  "aria-label": ariaLabel,
}: ActionButtonProps) {
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function run() {
    setFailed(false);
    startTransition(async () => {
      try {
        await action();
      } catch {
        setFailed(true);
      }
    });
  }

  const status = (
    <span role="status" aria-live="polite" className="sr-only">
      {pending ? pendingLabel : ""}
    </span>
  );
  const error = failed && (
    <span role="alert" className="text-12 leading-[1.4] font-medium text-danger-fg">
      {errorLabel}
    </span>
  );

  if (variant === "link") {
    return (
      <>
        <button
          type="button"
          onClick={pending || disabled ? undefined : run}
          aria-disabled={pending || disabled || undefined}
          aria-busy={pending || undefined}
          aria-label={ariaLabel}
          className={cn(
            "relative z-10 inline-flex shrink-0 items-center gap-1 text-12 leading-[1.4] font-semibold whitespace-nowrap text-accent hover:underline",
            pending && "cursor-wait",
            className,
          )}
        >
          {pending && <Spinner size={14} />}
          {children}
        </button>
        {status}
        {error}
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        leadingIcon={icon && icons[icon]}
        loading={pending}
        disabled={disabled}
        onClick={run}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </Button>
      {status}
      {error}
    </>
  );
}
