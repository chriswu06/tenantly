import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type TrustNoteProps = {
  children?: ReactNode;
  /** center: under the start actions. start: left-aligned privacy note (extracting). */
  align?: "center" | "start";
  className?: string;
};

/**
 * Lock icon with a short privacy reassurance.
 *
 * @example <TrustNote />
 */
export function TrustNote({
  children = "No account needed · Documents deleted after reading",
  align = "center",
  className,
}: TrustNoteProps) {
  return (
    <p
      className={cn(
        "flex items-center text-12 leading-[1.4] text-text-tertiary md:leading-[1.45]",
        align === "center" ? "justify-center gap-1.5 text-center" : "gap-2",
        className,
      )}
    >
      <Icon icon={Lock} size={14} />
      <span className={cn(align === "start" && "min-w-0 flex-1")}>{children}</span>
    </p>
  );
}
