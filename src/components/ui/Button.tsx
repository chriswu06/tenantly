import type { ComponentPropsWithRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "xs" | "sm" | "compact" | "md" | "lg" | "responsive";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-text-inverse",
  secondary: "border border-border-strong bg-bg-surface text-text-primary",
};

const hoverClasses: Record<ButtonVariant, string> = {
  primary: "hover:bg-accent/90",
  secondary: "hover:bg-bg-subtle",
};

// Heights: xs 32 (console toolbar), sm 36 (console), compact 38 (inline tenant),
// md 44 (tenant desktop), lg 48 (tenant mobile), responsive 48 → 44 from `md` up.
const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-8 gap-1.5 rounded-md px-2.5 text-13 font-medium",
  sm: "h-9 gap-1.5 rounded-md px-3 text-13",
  compact: "h-9.5 gap-2 rounded-lg px-3.5 text-13",
  md: "h-11 gap-2 rounded-lg px-4.5 text-14",
  lg: "h-12 gap-2 rounded-lg px-4 text-15",
  responsive: "h-12 gap-2 rounded-lg px-4 text-15 md:h-11 md:text-14",
};

const iconSize = { xs: 14, sm: 16, compact: 16, md: 18, lg: 18, responsive: 18 } as const;

/** Button styles for a <Link>, <a> or <label> that should look like a Button. */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "lg",
  className?: string,
) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center font-semibold leading-none whitespace-nowrap transition-colors",
    variantClasses[variant],
    sizeClasses[size],
    hoverClasses[variant],
    className,
  );
}

/**
 * Works in Server and Client Components (it defines no handlers of its own).
 *
 * @example <Button leadingIcon={Camera}>Scan summons</Button>
 */
export function Button({
  variant = "primary",
  size = "lg",
  leadingIcon,
  trailingIcon,
  disabled,
  type = "button",
  className,
  onClick,
  children,
  ...props
}: ButtonProps) {
  // aria-disabled instead of native `disabled` keeps the button focusable,
  // so screen reader users can still discover it and its label. Dropping
  // onClick while disabled stops activation without a wrapper handler.
  return (
    <button
      type={type}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold leading-none whitespace-nowrap transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        disabled ? "cursor-not-allowed opacity-50" : hoverClasses[variant],
        className,
      )}
      {...props}
    >
      {leadingIcon && <Icon icon={leadingIcon} size={iconSize[size]} />}
      {children}
      {trailingIcon && <Icon icon={trailingIcon} size={iconSize[size]} />}
    </button>
  );
}
