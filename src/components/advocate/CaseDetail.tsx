import type { ReactNode } from "react";
import {
  Check,
  Circle,
  Clock,
  Database,
  Download,
  FileText,
  MapPin,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import {
  daysUntil,
  formatDate,
  formatTime,
  formatWeekday,
  licenseResultBadge,
  shortAddress,
  type ActivityEvent,
  type AdvocateCase,
  type CaseDetailData,
  type NextAction,
} from "@/lib/mock/advocate";
import type { CaseStage } from "@/types/case";
import { notFound } from "next/navigation";
import { getAdvocateCase } from "@/lib/mock/advocate";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ConsoleHeader } from "./ConsoleHeader";
import { PageBody, Panel, PanelHeader } from "./ConsolePage";

/*
 * Case detail pieces (Figma frames 12 desktop, 12m / 52 / 53 mobile).
 * The three routes (Overview, Records, Activity) share <CaseHeader> and <CaseFooter>.
 */

export type CaseTab = "overview" | "records" | "activity";

const stageBadge: Partial<Record<CaseStage, { label: string; shortLabel: string; tone: BadgeTone }>> = {
  needs_certification: { label: "Certification pending", shortLabel: "Cert. pending", tone: "warn" },
  ready_for_court: { label: "Ready for court", shortLabel: "Ready for court", tone: "ok" },
  closed: { label: "Closed", shortLabel: "Closed", tone: "neutral" },
};

/** Looks the case up by reference from the route's `caseId`, or 404s. */
export function loadCase(caseId: string): AdvocateCase {
  const found = getAdvocateCase(decodeURIComponent(caseId));
  if (!found) notFound();
  return found;
}

const casePdfHref = (reference: string) => `/api/cases/${reference}/report?type=case`;

/** Page frame shared by the three case detail routes. */
export function CaseDetailShell({ caseData: c, tab, children }: { caseData: AdvocateCase; tab: CaseTab; children: ReactNode }) {
  return (
    <>
      <ConsoleHeader
        breadcrumbs={[{ label: "Cases", href: "/advocate/cases" }, { label: c.reference }]}
        title={c.reference}
        backHref="/advocate/cases"
      />
      <CaseHeader caseData={c} tab={tab} />
      <PageBody className="gap-3 lg:pt-5">{children}</PageBody>
      <CaseFooter reference={c.reference} />
    </>
  );
}

/** Case title block. The Overview / Records / Activity tabs are mobile only: frame 12 shows everything at once. */
export function CaseHeader({ caseData: c, tab }: { caseData: AdvocateCase; tab: CaseTab }) {
  const license = licenseResultBadge[c.licenseResult];
  const stage = stageBadge[c.stage];
  const base = `/advocate/cases/${c.reference}`;
  const address = shortAddress(c.propertyAddress);
  const tabs = (
    <Tabs
      variant="underline"
      label="Case sections"
      items={[
        { href: base, label: "Overview", active: tab === "overview" },
        { href: `${base}/records`, label: "Records", active: tab === "records" },
        { href: `${base}/activity`, label: "Activity", active: tab === "activity" },
      ]}
    />
  );

  return (
    <>
      {/* Mobile (frame 12m): white block under the back bar, whose <h1> is the case reference. */}
      <div className="flex flex-col gap-1.5 border-b border-border-default bg-bg-surface px-4 pt-1 lg:hidden">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={license.tone} dot>
            {license.label}
          </Badge>
          {stage && (
            <Badge tone={stage.tone} dot>
              {stage.shortLabel}
            </Badge>
          )}
        </div>
        <h2 className="text-20 leading-[1.25] font-semibold text-text-primary">{address}</h2>
        <p className="text-13 leading-[1.4] text-text-secondary">
          {c.landlordName} · {c.caseNumber}
        </p>
        {tabs}
      </div>

      {/* Desktop (frame 12). */}
      <div className="hidden flex-col gap-4 px-6 pt-6 lg:flex">
        <div className="flex items-end gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-13 leading-[1.45] text-text-secondary">{c.reference}</span>
              <Badge tone={license.tone} dot>
                {license.label}
              </Badge>
              {stage && (
                <Badge tone={stage.tone} dot>
                  {stage.label}
                </Badge>
              )}
            </div>
            <h1 className="text-24 font-semibold text-text-primary">{address}</h1>
            <p className="text-14 leading-[1.45] text-text-secondary">
              {c.landlordName} v. Tenant · Case {c.caseNumber}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <a href={casePdfHref(c.reference)} download className={buttonClassName("secondary", "sm")}>
              <Icon icon={Download} size={16} />
              Export case PDF
            </a>
            <Button size="sm" leadingIcon={FileText}>
              Record certification
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Mobile action bar pinned to the bottom (frame 12m). Takes the place of the tab bar. */
export function CaseFooter({ reference }: { reference: string }) {
  return (
    <>
      <div aria-hidden className="h-22 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-10 flex items-center gap-2.5 border-t border-border-default bg-bg-surface px-4 pt-3 pb-7 lg:hidden print:hidden">
        <a href={casePdfHref(reference)} download
          aria-label="Export case PDF"
          className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-bg-surface text-text-primary hover:bg-bg-subtle"
        >
          <Icon icon={Download} size={20} />
        </a>
        <Button leadingIcon={FileText} className="flex-1">
          Record certification
        </Button>
      </div>
    </>
  );
}

/**
 * Desktop case detail (frame 12): records on the left, next actions and activity on the right.
 * All three case routes show this on desktop; their tabs only split it up on mobile (12m, 52, 53).
 */
export function CaseDesktopView({ caseData, detail }: { caseData: AdvocateCase; detail: CaseDetailData }) {
  return (
    <div className="hidden lg:block">
      <CaseColumns
        aside={
          <>
            <NextActionsPanel actions={detail.nextActions} />
            <ActivityPanel events={detail.activity} />
          </>
        }
      >
        <LicenseVerificationPanel detail={detail} />
        <SummonsPanel caseData={caseData} />
      </CaseColumns>
    </div>
  );
}

/** Two columns on desktop: `children` on the left, `aside` (340px) on the right. Mobile shows only `children`. */
export function CaseColumns({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">{children}</div>
      <div className="hidden w-85 shrink-0 flex-col gap-4 lg:flex">{aside}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------- */

/** Case detail panels are 8px-radius cards with a tighter header on mobile. */
function CasePanel({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <Panel className="rounded-lg">
      <PanelHeader title={title} aside={aside} className="h-auto px-3.5 py-3 lg:h-12 lg:px-4 lg:py-0" />
      {children}
    </Panel>
  );
}

const resultStyle: Record<CaseDetailData["result"]["tone"], { box: string; icon: LucideIcon; iconClass: string }> = {
  ok: { box: "border-success-border bg-success-bg", icon: ShieldCheck, iconClass: "text-success-fg" },
  warn: { box: "border-warning-border bg-warning-bg", icon: TriangleAlert, iconClass: "text-warning-fg" },
  danger: { box: "border-danger-border bg-danger-bg", icon: ShieldAlert, iconClass: "text-danger-fg" },
};

/** Colored strip summarizing the license check. */
export function ResultStrip({
  result,
  text,
  compact = false,
  className,
}: {
  result: CaseDetailData["result"];
  text: string;
  /** Records tab (frame 52): 10px padding, 16px icon. */
  compact?: boolean;
  className?: string;
}) {
  const style = resultStyle[result.tone];
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border",
        compact ? "gap-2 p-2.5" : "p-3",
        style.box,
        className,
      )}
    >
      <Icon icon={style.icon} size={compact ? 16 : 18} className={cn("mt-px", style.iconClass)} />
      <p className="min-w-0 flex-1 text-13 leading-[1.4] font-medium text-text-primary">{text}</p>
    </div>
  );
}

/** Mobile hearing summary (frame 12m). */
export function HearingCard({ caseData: c }: { caseData: AdvocateCase }) {
  const [month, day] = formatDate(c.hearingDate, "month").split(" ");
  const days = daysUntil(c.hearingDate);
  const court = c.court.replace(/^District Court, /, "");
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
      <span className="flex shrink-0 flex-col items-center rounded-md bg-accent-subtle px-2 py-1 font-semibold text-accent">
        <span className="text-[10px] leading-[1.2] uppercase">{month}</span>
        <span className="text-18 leading-[1.1]">{day}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
        <span className="text-14 font-semibold text-text-primary">
          {days > 0 ? `Hearing in ${days} days` : days === 0 ? "Hearing today" : "Hearing passed"}
        </span>
        <span className="text-12 text-text-secondary">
          {formatWeekday(c.hearingDate)} · {formatTime(c.hearingDate)} · {court}
        </span>
      </span>
    </div>
  );
}

/** License verification: result, DHCD records and lookup details. */
export function LicenseVerificationPanel({ detail }: { detail: CaseDetailData }) {
  const meta = [
    { icon: Clock, text: detail.lookupMeta.checked },
    { icon: Database, text: detail.lookupMeta.source },
    { icon: MapPin, text: detail.lookupMeta.match },
  ];

  return (
    <CasePanel
      title="License verification"
      aside={
        <>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border-strong bg-bg-surface px-2.5 py-1.25 text-12 leading-none font-medium text-text-primary hover:bg-bg-subtle lg:hidden"
          >
            <Icon icon={RefreshCw} size={14} />
            Re-run
          </button>
          <Button variant="secondary" size="sm" leadingIcon={RefreshCw} className="hidden lg:inline-flex">
            Re-run
          </Button>
        </>
      }
    >
      {/* Mobile (frame 52) */}
      <div className="flex flex-col gap-2.5 p-3.5 lg:hidden">
        <ResultStrip result={detail.result} text={detail.result.recordsText} compact />
        {detail.records.map((r) => (
          <div key={r.number} className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-app p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-13 leading-[1.4] text-text-primary">{r.number}</span>
              <RecordBadge status={r.status} />
            </div>
            <p className="text-12 leading-[1.4] text-text-secondary">
              Valid {r.validFrom} – {r.validTo} · {r.source}
            </p>
          </div>
        ))}
        {meta.map((m) => (
          <p key={m.text} className="flex items-center gap-1.5 text-12 leading-[1.4] text-text-tertiary">
            <Icon icon={m.icon} size={14} />
            {m.text}
          </p>
        ))}
      </div>

      {/* Desktop (frame 12) */}
      <div className="hidden flex-col gap-3 p-4 lg:flex">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md border p-3",
            resultStyle[detail.result.tone].box,
          )}
        >
          <Icon icon={resultStyle[detail.result.tone].icon} size={18} className={resultStyle[detail.result.tone].iconClass} />
          <p className="min-w-0 flex-1 text-13 leading-[1.45] font-medium text-text-primary">{detail.result.text}</p>
        </div>
        {detail.records.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-border-default">
            <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
              <thead className="bg-bg-app">
                <tr className="border-b border-border-default">
                  {[
                    ["License #", "w-[150px]"],
                    ["Status", "w-[120px]"],
                    ["Valid from", "w-[110px]"],
                    ["Valid to", "w-[110px]"],
                    ["Source", ""],
                  ].map(([label, width]) => (
                    <th
                      key={label}
                      scope="col"
                      className={cn(
                        "h-8 text-12 leading-[1.45] font-medium whitespace-nowrap text-text-tertiary first:pl-3 last:pr-3",
                        width,
                      )}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.records.map((r) => (
                  <tr key={r.number} className="border-b border-border-default last:border-b-0">
                    <td className="h-10 pl-3 font-mono text-13 leading-[1.45] text-text-primary">{r.number}</td>
                    <td>
                      <RecordBadge status={r.status} />
                    </td>
                    <td className="text-13 leading-[1.45] text-text-primary">{r.validFrom}</td>
                    <td className="text-13 leading-[1.45] text-text-primary">{r.validTo}</td>
                    <td className="truncate pr-3 text-13 leading-[1.45] text-text-secondary">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {meta.map((m) => (
            <p key={m.text} className="flex items-center gap-1.5 text-12 leading-[1.45] text-text-tertiary">
              <Icon icon={m.icon} size={14} />
              {m.text}
            </p>
          ))}
        </div>
      </div>
    </CasePanel>
  );
}

function RecordBadge({ status }: { status: "Expired" | "Active" }) {
  return (
    <Badge tone={status === "Expired" ? "danger" : "neutral"} dot>
      {status}
    </Badge>
  );
}

/** Fields read from the summons. Key–value rows on mobile, a 3-column grid on desktop. */
export function SummonsPanel({ caseData: c }: { caseData: AdvocateCase }) {
  const fields: { label: string; value: string; mono?: boolean }[] = [
    { label: "Case number", value: c.caseNumber, mono: true },
    { label: "Court", value: c.court },
    { label: "Plaintiff", value: c.landlordName },
    { label: "Filed", value: formatDate(c.filingDate, "long") },
    { label: "Hearing", value: `${formatDate(c.hearingDate, "long")} · ${formatTime(c.hearingDate)}` },
    { label: "License # on complaint", value: c.licenseNumberOnComplaint ?? "Not listed" },
  ];

  return (
    <CasePanel
      title="Summons details"
      aside={
        <Badge tone="accent" dot>
          Extracted
        </Badge>
      }
    >
      <dl className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-3.5 lg:p-4">
        {fields.map((f) => (
          <div
            key={f.label}
            className="flex gap-3 border-b border-border-default px-3.5 py-2.5 text-13 leading-[1.4] last:border-b-0 lg:flex-col lg:gap-0.5 lg:border-b-0 lg:p-0 lg:leading-[1.45]"
          >
            <dt className="w-30 shrink-0 text-text-secondary lg:w-auto lg:text-12 lg:text-text-tertiary">{f.label}</dt>
            <dd className={cn("min-w-0 flex-1 text-text-primary", f.mono ? "font-mono" : "font-medium")}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </CasePanel>
  );
}

/** Checklist of next steps with due dates. */
export function NextActionsPanel({ actions }: { actions: NextAction[] }) {
  const done = actions.filter((a) => a.done).length;
  return (
    <CasePanel
      title="Next actions"
      aside={
        <p className="shrink-0 text-12 leading-[1.4] text-text-tertiary">
          {done} of {actions.length}
        </p>
      }
    >
      <ul className="lg:px-4 lg:py-1">
        {actions.map((a) => (
          <li
            key={a.label}
            className="flex items-center gap-2.5 border-b border-border-default px-3.5 py-2.75 last:border-b-0 lg:px-0 lg:py-2.5"
          >
            <Icon
              icon={a.done ? Check : Circle}
              size={16}
              className={a.done ? "text-success-fg" : "text-text-secondary"}
              label={a.done ? "Done" : undefined}
            />
            <span
              className={cn(
                "min-w-0 flex-1 text-13 leading-[1.4] lg:leading-[1.45]",
                a.done ? "text-text-tertiary" : "font-medium text-text-primary",
              )}
            >
              {a.label}
            </span>
            <span
              className={cn(
                "shrink-0 text-12 leading-[1.4] font-medium whitespace-nowrap",
                a.urgent ? "text-warning-fg" : "text-text-tertiary",
              )}
            >
              {a.due}
            </span>
          </li>
        ))}
      </ul>
    </CasePanel>
  );
}

/** Case timeline, oldest first. */
export function ActivityPanel({ events }: { events: ActivityEvent[] }) {
  return (
    <CasePanel title="Activity">
      <ol className="flex flex-col gap-4 p-3.5 lg:gap-3.5 lg:p-4">
        {events.map((e) => (
          <li key={`${e.title}-${e.meta}`} className="flex items-start gap-2.5">
            <span aria-hidden className="mt-[5px] size-2 shrink-0 rounded-full bg-border-strong" />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4] lg:leading-[1.45]">
              <span className="text-13 font-medium text-text-primary">{e.title}</span>
              <span className="text-12 text-text-tertiary">{e.meta}</span>
            </span>
          </li>
        ))}
      </ol>
    </CasePanel>
  );
}
