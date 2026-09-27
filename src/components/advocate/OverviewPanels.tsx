import Link from "next/link";
import { CalendarCheck, CircleAlert, CircleCheck, FileText, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { assignToMe } from "@/lib/cases/advocate-actions";
import type { AttentionItem, Hearing } from "@/lib/cases/queries";
import { ActionButton } from "./ActionButton";
import { BadgeSkeleton, LineSkeleton, Panel, PanelHeader, PanelMeta } from "./ConsolePage";
import { licenseResultBadge } from "./display";

export { OverviewGreeting } from "./OverviewGreeting";

const rowLink = "flex items-center gap-3 px-4 py-3 hover:bg-bg-app";
const rowItem = "border-b border-border-default last:border-b-0";

/** Count in a panel header while it loads. */
function MetaSkeleton() {
  return <LineSkeleton className="w-4 shrink-0 text-12 leading-[1.4]" />;
}

export function HearingsPanel({ hearings, total }: { hearings: Hearing[]; total: number }) {
  return (
    <Panel>
      <PanelHeader title="Hearings this week" aside={<PanelMeta className="font-semibold">{total}</PanelMeta>} />
      {hearings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No hearings this week"
          description="Hearings for cases shared with your organization will show up here."
        />
      ) : (
        <ul>
          {hearings.map((h) => {
            const badge = licenseResultBadge[h.result];
            const cert =
              h.certification === "requested"
                ? {
                    desktop: "Requested",
                    mobile: "Cert. requested",
                    className: "text-text-tertiary",
                  }
                : h.certification === "not_requested"
                  ? {
                      desktop: "Not requested",
                      mobile: "Cert. not requested",
                      className: "text-warning-fg",
                    }
                  : null;
            return (
              <li key={`${h.reference}-${h.day}`} className={rowItem}>
                <Link href={`/advocate/cases/${h.reference}`} className={rowLink}>
                  <span className="w-18 shrink-0 text-13 leading-[1.4] font-medium text-text-secondary">{h.day}</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
                    <span className="min-w-0 text-14 leading-[1.4] font-medium text-text-primary lg:flex-1">
                      {h.address}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 lg:contents">
                      <Badge tone={badge.tone} dot>
                        {badge.label}
                      </Badge>
                      {cert && (
                        <span
                          className={cn(
                            "text-12 leading-[1.4] font-medium whitespace-nowrap lg:hidden",
                            cert.className,
                          )}
                        >
                          {cert.mobile}
                        </span>
                      )}
                      <span
                        className={cn(
                          "hidden w-22.5 shrink-0 text-12 leading-[1.4] font-medium lg:block",
                          cert ? cert.className : "text-text-tertiary",
                        )}
                      >
                        {cert ? cert.desktop : "—"}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

const attentionStyle: Record<AttentionItem["kind"], { icon: LucideIcon; tile: string; action: string }> = {
  certification: {
    icon: FileText,
    tile: "bg-warning-bg text-warning-fg",
    action: "text-warning-fg",
  },
  verify: {
    icon: CircleAlert,
    tile: "bg-danger-bg text-danger-fg",
    action: "text-accent",
  },
  unassigned: {
    icon: Users,
    tile: "bg-bg-subtle text-text-secondary",
    action: "text-accent",
  },
};

export function AttentionPanel({ items }: { items: AttentionItem[] }) {
  return (
    <Panel>
      <PanelHeader title="Needs attention" aside={<PanelMeta className="font-semibold">{items.length}</PanelMeta>} />
      {items.length === 0 ? (
        <EmptyState
          icon={CircleCheck}
          title="Nothing needs attention"
          description="Cases that need a certification, a re-run or an assignee will show up here."
        />
      ) : (
        <ul>
          {items.map((item) => {
            const style = attentionStyle[item.kind];
            const icon = (
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", style.tile)}>
                <Icon icon={style.icon} size={16} />
              </span>
            );
            const text = (
              <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
                <span className="text-14 font-medium text-text-primary">{item.title}</span>
                <span className="text-12 text-text-tertiary">
                  {item.reference}
                  {item.hearing && ` · Hearing ${item.hearing}`}
                </span>
              </span>
            );
            return (
              <li key={`${item.kind}-${item.reference}`} className={rowItem}>
                {item.kind === "unassigned" ? (
                  // "Assign" takes the case on the spot; the rest of the row still opens it.
                  <div className={cn(rowLink, "relative")}>
                    {icon}
                    <Link
                      href={`/advocate/cases/${item.reference}`}
                      className="flex min-w-0 flex-1 after:absolute after:inset-0 after:content-['']"
                    >
                      {text}
                    </Link>
                    <ActionButton
                      variant="link"
                      action={assignToMe.bind(null, item.reference)}
                      pendingLabel={`Assigning ${item.reference} to you`}
                      aria-label={`Assign ${item.reference} to me`}
                      className={style.action}
                    >
                      {item.action}
                    </ActionButton>
                  </div>
                ) : (
                  <Link href={`/advocate/cases/${item.reference}`} className={rowLink}>
                    {icon}
                    {text}
                    <span className={cn("shrink-0 text-12 leading-[1.4] font-semibold whitespace-nowrap", style.action)}>
                      {item.action}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

/** Loading "Hearings this week": rows sized like the real ones. */
export function HearingsPanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Panel>
      <PanelHeader title="Hearings this week" aside={<MetaSkeleton />} />
      <ul>
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className={cn(rowItem, "flex items-center gap-3 px-4 py-3")}>
            <LineSkeleton className="w-18 shrink-0 text-13 leading-[1.4]" barClassName="w-14" />
            <div className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
              <LineSkeleton className="text-14 leading-[1.4] lg:flex-1" barClassName="w-40" />
              <div className="flex items-center gap-2 lg:contents">
                <BadgeSkeleton className="w-28" />
                <LineSkeleton className="w-22.5 shrink-0 text-12 leading-[1.4] lg:hidden" barClassName="w-full" />
                <LineSkeleton className="hidden w-22.5 shrink-0 text-12 leading-[1.4] lg:flex" barClassName="w-16" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Loading "Needs attention": icon tile, two lines and the action per row. */
export function AttentionPanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Panel>
      <PanelHeader title="Needs attention" aside={<MetaSkeleton />} />
      <ul>
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className={cn(rowItem, "flex items-center gap-3 px-4 py-3")}>
            <Skeleton className="size-8 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
              <LineSkeleton className="text-14" barClassName="w-40" />
              <LineSkeleton className="text-12" barClassName="w-48" />
            </div>
            <LineSkeleton className="w-14 shrink-0 text-12 leading-[1.4]" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
