import type { ComponentPropsWithRef, MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "lg";

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

// sm: advocate console (36px, radius 6). lg: tenant flow and web (48px, radius 8).
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-md px-3 text-13",
  lg: "h-12 gap-2 rounded-lg px-4 text-15",
};

const iconSize = { sm: 16, lg: 18 } as const;

/**
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
  // so screen reader users can still discover it and its label.
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
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
