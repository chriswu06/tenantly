"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

type SubmitButtonProps = Omit<ComponentPropsWithRef<"button">, "type" | "children"> & {
  /**
   * Leading icon element, e.g. `<Icon icon={Pencil} size={18} />` (an element, so
   * Server Components can pass it). A spinner of `iconSize` replaces it while submitting.
   */
  icon?: ReactNode;
  iconSize?: 14 | 16 | 18;
  /** Trailing icon element, hidden while submitting. */
  trailingIcon?: ReactNode;
  /** Force the pending look, e.g. from useActionState when the button sits outside the form. */
  pending?: boolean;
  children: ReactNode;
};

/**
 * Submit button for a Server Action form. Style it with `buttonClassName(…)`.
 * While the form is submitting it shows a spinner and ignores further clicks.
 *
 * @example <form action={startManually}><SubmitButton icon={<Icon icon={Pencil} size={18} />} className={buttonClassName("secondary")}>Enter details manually</SubmitButton></form>
 */
export function SubmitButton({
  icon,
  iconSize = 18,
  trailingIcon,
  pending: pendingProp,
  className,
  onClick,
  children,
  ...props
}: SubmitButtonProps) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;

  return (
    <button
      type="submit"
      aria-disabled={pending || undefined}
      aria-busy={pending || undefined}
      onClick={(event) => {
        if (pending) event.preventDefault();
        else onClick?.(event);
      }}
      className={cn(pending && "cursor-wait", className)}
      {...props}
    >
      {icon && (pending ? <Spinner size={iconSize} /> : icon)}
      {children}
      {!pending && trailingIcon}
    </button>
  );
}
