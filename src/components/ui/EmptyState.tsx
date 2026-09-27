import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** A button or link, e.g. "Clear filter" or "Invite a teammate". */
  action?: ReactNode;
  className?: string;
};

/**
 * Shown in place of a list or table with nothing in it. Sits inside the card
 * or table that would hold the rows, so the page layout stays the same.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-10 text-center", className)}>
      <span className="flex size-10 items-center justify-center rounded-full bg-bg-subtle text-text-tertiary">
        <Icon icon={icon} size={20} />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-14 font-semibold text-text-primary">{title}</p>
        {description && <p className="text-13 text-text-secondary">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
