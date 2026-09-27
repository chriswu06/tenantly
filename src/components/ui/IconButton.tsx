import type { ComponentPropsWithRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type IconButtonVariant = "ghost" | "outline";

// ghost: 40px app bar buttons. outline: 32px bordered buttons (table pager).
const variantClasses: Record<IconButtonVariant, string> = {
  ghost: "size-10 rounded-lg not-disabled:hover:bg-bg-subtle",
  outline: "size-8 rounded-md border border-border-strong bg-bg-surface not-disabled:hover:bg-bg-subtle",
};

const iconSize = { ghost: 20, outline: 16 } as const;

/** Shared with links that should look like an icon button, e.g. the app bar back link. */
export function iconButtonClassName(variant: IconButtonVariant = "ghost", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center text-text-primary transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    className,
  );
}

type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  icon: LucideIcon;
  /** Accessible name; icon buttons have no visible text. */
  label: string;
  variant?: IconButtonVariant;
};

/**
 * @example <IconButton icon={Menu} label="Open menu" onClick={open} />
 */
export function IconButton({
  icon,
  label,
  variant = "ghost",
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={iconButtonClassName(variant, className)}
      {...props}
    >
      <Icon icon={icon} size={iconSize[variant]} />
    </button>
  );
}
