import Link from "next/link";
import { CircleAlert, FileText, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { licenseResultBadge, type AttentionItem, type Hearing } from "@/lib/mock/advocate";
import { Panel, PanelHeader, PanelMeta } from "./ConsolePage";

const rowLink = "flex items-center gap-3 px-4 py-3 hover:bg-bg-app";

/** "Hearings this week" panel (frames 50, 51). */
export function HearingsPanel({ hearings, total }: { hearings: Hearing[]; total: number }) {
  return (
    <Panel>
      <PanelHeader title="Hearings this week" aside={<PanelMeta className="font-semibold">{total}</PanelMeta>} />
      <ul>
        {hearings.map((h) => {
          const badge = licenseResultBadge[h.result];
          const cert =
            h.certification === "requested"
              ? { desktop: "Requested", mobile: "Cert. requested", className: "text-text-tertiary" }
              : h.certification === "not_requested"
                ? { desktop: "Not requested", mobile: "Cert. not requested", className: "text-warning-fg" }
                : null;
          return (
            <li key={`${h.reference}-${h.day}`} className="border-b border-border-default last:border-b-0">
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
                      <span className={cn("text-12 leading-[1.4] font-medium whitespace-nowrap lg:hidden", cert.className)}>
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
    </Panel>
  );
}

const attentionStyle: Record<AttentionItem["kind"], { icon: LucideIcon; tile: string; action: string }> = {
  certification: { icon: FileText, tile: "bg-warning-bg text-warning-fg", action: "text-warning-fg" },
  verify: { icon: CircleAlert, tile: "bg-danger-bg text-danger-fg", action: "text-accent" },
  unassigned: { icon: Users, tile: "bg-bg-subtle text-text-secondary", action: "text-accent" },
};

/** "Needs attention" panel (frames 50, 51). */
export function AttentionPanel({ items }: { items: AttentionItem[] }) {
  return (
    <Panel>
      <PanelHeader title="Needs attention" aside={<PanelMeta className="font-semibold">{items.length}</PanelMeta>} />
      <ul>
        {items.map((item) => {
          const style = attentionStyle[item.kind];
          return (
            <li key={item.reference} className="border-b border-border-default last:border-b-0">
              <Link href={`/advocate/cases/${item.reference}`} className={rowLink}>
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", style.tile)}>
                  <Icon icon={style.icon} size={16} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
                  <span className="text-14 font-medium text-text-primary">{item.title}</span>
                  <span className="text-12 text-text-tertiary">
                    {item.reference} · Hearing {item.hearing}
                  </span>
                </span>
                <span className={cn("shrink-0 text-12 leading-[1.4] font-semibold whitespace-nowrap", style.action)}>
                  {item.action}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
