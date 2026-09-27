import { Check, FileText, LoaderCircle, X, type LucideIcon } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { FieldReadStatus } from "@/lib/mock/scan";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  FieldReadStatus,
  { icon: LucideIcon; iconClass: string; tone: BadgeTone; badge: string; muted?: boolean }
> = {
  found: { icon: Check, iconClass: "text-success-fg", tone: "ok", badge: "Found" },
  reading: {
    icon: LoaderCircle,
    iconClass: "text-accent motion-safe:animate-spin",
    tone: "accent",
    badge: "Reading…",
  },
  pending: { icon: FileText, iconClass: "text-text-tertiary", tone: "neutral", badge: "Pending", muted: true },
  unreadable: { icon: X, iconClass: "text-danger-fg", tone: "danger", badge: "Not readable" },
};

type FieldStatusListProps = {
  fields: { label: string; status: FieldReadStatus }[];
  /** Row padding: 12px (extracting) or 11px (couldn't read). */
  dense?: boolean;
  className?: string;
};

/** Card listing each summons field and whether it could be read (frames 03, 15, 33, 34). */
export function FieldStatusList({ fields, dense = false, className }: FieldStatusListProps) {
  return (
    <ul
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]",
        className,
      )}
    >
      {fields.map(({ label, status }) => {
        const style = statusStyles[status];
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-3 border-b border-border-default px-4 last:border-b-0",
              dense ? "py-[11px]" : "py-3 md:py-[13px]",
            )}
          >
            <Icon icon={style.icon} size={18} className={style.iconClass} />
            <span
              className={cn(
                "min-w-0 flex-1 text-14 leading-[1.4] md:leading-[1.45]",
                style.muted ? "text-text-tertiary" : "text-text-primary",
              )}
            >
              {label}
            </span>
            <Badge tone={style.tone}>{style.badge}</Badge>
          </li>
        );
      })}
    </ul>
  );
}
