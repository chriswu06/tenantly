import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

// Lucide scales the stroke width with the icon size, so no strokeWidth is set.
type IconSize = 12 | 14 | 16 | 17 | 18 | 20 | 22 | 24;

type IconProps = Omit<LucideProps, "size" | "ref"> & {
  icon: LucideIcon;
  size?: IconSize;
  /** Accessible name. Leave empty for decorative icons next to visible text. */
  label?: string;
};

/**
 * Renders a Lucide icon at a design-system size.
 *
 * @example <Icon icon={Camera} size={18} />
 */
export function Icon({ icon: Glyph, size = 20, label, className, ...props }: IconProps) {
  return (
    <Glyph
      size={size}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable={false}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
