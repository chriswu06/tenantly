import type { ReactNode } from "react";
import { CircleAlert, CircleHelp, ShieldCheck, type LucideIcon } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type StatusPanelTone = "ok" | "warn" | "danger";

const toneStyles: Record<StatusPanelTone, { border: string; tile: string; icon: LucideIcon; badge: BadgeTone }> = {
  ok: { border: "border-success-border", tile: "bg-success-bg text-success-fg", icon: ShieldCheck, badge: "ok" },
  warn: { border: "border-warning-border", tile: "bg-warning-bg text-warning-fg", icon: CircleHelp, badge: "warn" },
  danger: { border: "border-danger-border", tile: "bg-danger-bg text-danger-fg", icon: CircleAlert, badge: "danger" },
};

type StatusPanelProps = {
  tone: StatusPanelTone;
  /** Badge text, e.g. "Possible defense". */
  badge: string;
  title: string;
  description: ReactNode;
  /** Heading level for the title; the Results page uses it as its h1. */
  titleAs?: "h1" | "h2";
  icon?: LucideIcon;
  className?: string;
};

/**
 * DHCD license check result (Figma component "Result status", 19:336).
 * "ok" is the tenant-favourable outcome: no active license, so a possible defense.
 *
 * @example <StatusPanel tone="ok" badge="Possible defense" title="No active rental license found" description="…" />
 */
export function StatusPanel({
  tone,
  badge,
  title,
  description,
  titleAs: Title = "h2",
  icon,
  className,
}: StatusPanelProps) {
  const styles = toneStyles[tone];
  return (
    <section
      className={cn("flex w-full flex-col gap-2.5 rounded-lg border bg-bg-surface p-4 md:p-6", styles.border, className)}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", styles.tile)}>
          <Icon icon={icon ?? styles.icon} size={20} />
        </span>
        <Badge tone={styles.badge} dot>
          {badge}
        </Badge>
      </div>
      <Title className="text-20 leading-[1.25] font-semibold text-text-primary md:text-18 md:leading-[1.3] md:tracking-[-0.18px]">
        {title}
      </Title>
      <p className="text-14 leading-[1.5] text-text-secondary md:leading-[1.45]">{description}</p>
    </section>
  );
}
