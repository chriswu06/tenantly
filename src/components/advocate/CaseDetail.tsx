import type { ReactNode } from "react";
import {
  Check,
  Circle,
  Clock,
  Database,
  Download,
  FileSearch,
  FileText,
  History,
  MapPin,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { assignToMe, recordCertification, rerunLookup } from "@/lib/cases/advocate-actions";
import type { ActivityEvent, AdvocateCase, CaseDetailData, NextAction } from "@/lib/cases/queries";
import type { CaseStage } from "@/types/case";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ActionButton } from "./ActionButton";
import { ConsoleHeader } from "./ConsoleHeader";
import { BadgeSkeleton, LineSkeleton, PageBody, Panel, PanelHeader } from "./ConsolePage";
import { daysFromToday, formatDate, formatTime, formatWeekday, licenseResultBadge, shortAddress } from "./display";

/* The three case detail routes (Overview, Records, Activity) share <CaseHeader> and <CaseFooter>. */

export type CaseTab = "overview" | "records" | "activity";

const stageBadge: Partial<Record<CaseStage, { label: string; shortLabel: string; tone: BadgeTone }>> = {
  needs_certification: { label: "Certification pending", shortLabel: "Cert. pending", tone: "warn" },
  ready_for_court: { label: "Ready for court", shortLabel: "Ready for court", tone: "ok" },
  closed: { label: "Closed", shortLabel: "Closed", tone: "neutral" },
};

const casePdfHref = (reference: string) => `/api/cases/${reference}/report?type=case`;

/** Next actions as the panel shows them; `href` makes the due text a link (e.g. the tenant's phone). */
export type CaseAction = NextAction & { href?: string };

const CONFIRM_WITH_TENANT = "Confirm documents with tenant";

/**
 * The case's next actions, with the tenant's first name and phone on "Confirm documents with tenant"
 * once they have shared the case (and nothing there before that).
 */
export function caseActions(c: AdvocateCase, actions: NextAction[]): CaseAction[] {
  return actions.map((a) => {
    if (a.label !== CONFIRM_WITH_TENANT) return a;
    if (!c.sharedAt || !c.tenantPhone) return { ...a, due: "" };
    const name = c.tenantFirstName ? `${c.tenantFirstName} · ` : "";
    return { ...a, due: `${name}${c.tenantPhone}`, href: `tel:${c.tenantPhone.replace(/[^\d+]/g, "")}` };
  });
}

/** Page frame shared by the three case detail routes. */
export function CaseDetailShell({
  caseData: c,
  tab,
  certificationRecorded,
  children,
}: {
  caseData: AdvocateCase;
  tab: CaseTab;
  /** The DHCD certification is on file, so "Record certification" is done. */
  certificationRecorded: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <ConsoleHeader
        breadcrumbs={[{ label: "Cases", href: "/advocate/cases" }, { label: c.reference }]}
        title={c.reference}
        backHref="/advocate/cases"
      />
      <CaseHeader caseData={c} tab={tab} certificationRecorded={certificationRecorded} />
      <PageBody className="gap-3 lg:pt-5">{children}</PageBody>
      <CaseFooter reference={c.reference} certificationRecorded={certificationRecorded} />
    </>
  );
}

/** "Record certification", or a done state once it's recorded. */
function RecordCertificationButton({
  reference,
  recorded,
  size = "sm",
  className,
}: {
  reference: string;
  recorded: boolean;
  size?: "sm" | "lg";
  className?: string;
}) {
  if (recorded) {
    return (
      <Button size={size} variant="secondary" leadingIcon={Check} disabled className={className}>
        Certification recorded
      </Button>
    );
  }
  return (
    <ActionButton
      variant="primary"
      size={size}
      icon="file"
      action={recordCertification.bind(null, reference)}
      pendingLabel="Recording certification"
      className={className}
    >
      Record certification
    </ActionButton>
  );
}

/** Case title block. The Overview / Records / Activity tabs are mobile only: desktop shows everything at once. */
export function CaseHeader({
  caseData: c,
  tab,
  certificationRecorded,
}: {
  caseData: AdvocateCase;
  tab: CaseTab;
  certificationRecorded: boolean;
}) {
  const assign = !c.assignee && (
    <ActionButton
      variant="link"
      action={assignToMe.bind(null, c.reference)}
      pendingLabel="Assigning the case to you"
    >
      Assign to me
    </ActionButton>
  );
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
      {/* Mobile: white block under the back bar, whose <h1> is the case reference. */}
      <div className="flex flex-col gap-1.5 border-b border-border-default bg-bg-surface px-4 pt-1 lg:hidden">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={license.tone} dot>
            {license.label}
          </Badge>
          {stage && (
            <Badge tone={stage.tone} dot>
              {stage.shortLabel}
            </Badge>
          )}
          {assign && <span className="ml-auto">{assign}</span>}
        </div>
        <h2 className="text-20 leading-[1.25] font-semibold text-text-primary">{address}</h2>
        <p className="text-13 leading-[1.4] text-text-secondary">
          {[c.landlordName, c.caseNumber].filter(Boolean).join(" · ")}
        </p>
        {tabs}
      </div>

      {/* Desktop */}
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
              {c.landlordName || "Landlord"} v. Tenant{c.caseNumber && ` · Case ${c.caseNumber}`}
              {" · "}
              {c.assignee ? `Assigned to ${c.assignee}` : "Unassigned"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!c.assignee && (
              <ActionButton
                size="sm"
                icon="user-plus"
                action={assignToMe.bind(null, c.reference)}
                pendingLabel="Assigning the case to you"
              >
                Assign to me
              </ActionButton>
            )}
            <a href={casePdfHref(c.reference)} download className={buttonClassName("secondary", "sm")}>
              <Icon icon={Download} size={16} />
              Export case PDF
            </a>
            <RecordCertificationButton reference={c.reference} recorded={certificationRecorded} />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Mobile action bar pinned to the bottom, in place of the tab bar.
 * Without a `reference` (while the case loads) both actions show but are disabled.
 */
export function CaseFooter({ reference, certificationRecorded = false }: { reference?: string; certificationRecorded?: boolean }) {
  const exportClass =
    "flex size-12 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-bg-surface text-text-primary";
  return (
    <>
      <div aria-hidden className="h-22 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-10 flex items-center gap-2.5 border-t border-border-default bg-bg-surface px-4 pt-3 pb-7 lg:hidden print:hidden">
        {reference ? (
          <a
            href={casePdfHref(reference)}
            download
            aria-label="Export case PDF"
            className={cn(exportClass, "hover:bg-bg-subtle")}
          >
            <Icon icon={Download} size={20} />
          </a>
        ) : (
          <span role="link" aria-disabled="true" aria-label="Export case PDF" className={cn(exportClass, "opacity-50")}>
            <Icon icon={Download} size={20} />
          </span>
        )}
        {reference ? (
          <RecordCertificationButton reference={reference} recorded={certificationRecorded} size="lg" className="flex-1" />
        ) : (
          <Button leadingIcon={FileText} className="flex-1" disabled>
            Record certification
          </Button>
        )}
      </div>
    </>
  );
}

/**
 * Desktop case detail: records on the left, next actions and activity on the right.
 * All three case routes show this on desktop; their tabs only split it up on mobile.
 */
export function CaseDesktopView({ caseData, detail }: { caseData: AdvocateCase; detail: CaseDetailData }) {
  return (
    <div className="hidden lg:block">
      <CaseColumns
        aside={
          <>
            <NextActionsPanel actions={caseActions(caseData, detail.nextActions)} />
            <ActivityPanel events={detail.activity} />
          </>
        }
      >
        <LicenseVerificationPanel reference={caseData.reference} detail={detail} />
        <SummonsPanel caseData={caseData} />
      </CaseColumns>
    </div>
  );
}

/** Two columns on desktop: `children` on the left, `aside` on the right. Mobile shows only `children`. */
export function CaseColumns({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">{children}</div>
      <div className="hidden w-85 shrink-0 flex-col gap-4 lg:flex">{aside}</div>
    </div>
  );
}

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
  /** Tighter padding and a smaller icon, for the Records tab. */
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

/** Mobile hearing summary. */
export function HearingCard({ caseData: c }: { caseData: AdvocateCase }) {
  if (!c.hearingDate) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
        <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
          <span className="text-14 font-semibold text-text-primary">No hearing date yet</span>
          <span className="text-12 text-text-secondary">It wasn’t on the summons the tenant scanned.</span>
        </span>
      </div>
    );
  }
  const [month, day] = formatDate(c.hearingDate, "month").split(" ");
  const days = daysFromToday(c.hearingDate);
  const court = c.court.replace(/^District Court, /, "");
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
      <span className="flex shrink-0 flex-col items-center rounded-md bg-accent-subtle px-2 py-1 font-semibold text-accent">
        <span className="text-[10px] leading-[1.2] uppercase">{month}</span>
        <span className="text-18 leading-[1.1]">{day}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
        <span className="text-14 font-semibold text-text-primary">
          {days > 1
            ? `Hearing in ${days} days`
            : days === 1
              ? "Hearing tomorrow"
              : days === 0
                ? "Hearing today"
                : "Hearing passed"}
        </span>
        <span className="text-12 text-text-secondary">
          {formatWeekday(c.hearingDate)} · {formatTime(c.hearingDate)}
          {court && ` · ${court}`}
        </span>
      </span>
    </div>
  );
}

/** License verification: result, DHCD records and lookup details. */
export function LicenseVerificationPanel({ reference, detail }: { reference: string; detail: CaseDetailData }) {
  const rerun = rerunLookup.bind(null, reference);
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
          <ActionButton
            size="xs"
            icon="refresh"
            action={rerun}
            pendingLabel="Re-running the license lookup"
            className="h-6.5 px-2.5 text-12 lg:hidden"
          >
            Re-run
          </ActionButton>
          <ActionButton
            size="sm"
            icon="refresh"
            action={rerun}
            pendingLabel="Re-running the license lookup"
            className="hidden lg:inline-flex"
          >
            Re-run
          </ActionButton>
        </>
      }
    >
      {/* Mobile */}
      <div className="flex flex-col gap-2.5 p-3.5 lg:hidden">
        <ResultStrip result={detail.result} text={detail.result.recordsText} compact />
        {detail.records.length === 0 && (
          <div className="rounded-lg border border-border-default bg-bg-app">
            <NoRecordsState tone={detail.result.tone} />
          </div>
        )}
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

      {/* Desktop */}
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
        {detail.records.length === 0 ? (
          <div className="rounded-md border border-border-default bg-bg-app">
            <NoRecordsState tone={detail.result.tone} />
          </div>
        ) : (
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

/** In place of the license records when DHCD returned none. */
function NoRecordsState({ tone }: { tone: CaseDetailData["result"]["tone"] }) {
  return (
    <EmptyState
      icon={FileSearch}
      title="No license records found for this address"
      description={
        tone === "danger"
          ? "The lookup didn’t return any records. Re-run the check to try again."
          : "DHCD has no rental license on file that matches this address."
      }
      className="py-6"
    />
  );
}

function RecordBadge({ status }: { status: "Expired" | "Active" }) {
  return (
    <Badge tone={status === "Expired" ? "danger" : "neutral"} dot>
      {status}
    </Badge>
  );
}

const summonsFields: { label: string; value: (c: AdvocateCase) => string; mono?: boolean }[] = [
  { label: "Case number", value: (c) => c.caseNumber, mono: true },
  { label: "Court", value: (c) => c.court },
  { label: "Plaintiff", value: (c) => c.landlordName },
  { label: "Filed", value: (c) => formatDate(c.filingDate, "long") },
  {
    label: "Hearing",
    value: (c) => (c.hearingDate ? `${formatDate(c.hearingDate, "long")} · ${formatTime(c.hearingDate)}` : "—"),
  },
  { label: "License # on complaint", value: (c) => c.licenseNumberOnComplaint ?? "Not listed" },
];

const summonsListClass = "grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-3.5 lg:p-4";
const summonsRowClass =
  "flex gap-3 border-b border-border-default px-3.5 py-2.5 text-13 leading-[1.4] last:border-b-0 lg:flex-col lg:gap-0.5 lg:border-b-0 lg:p-0 lg:leading-[1.45]";
const summonsLabelClass = "w-30 shrink-0 text-text-secondary lg:w-auto lg:text-12 lg:text-text-tertiary";

function SummonsPanelFrame({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <CasePanel title="Summons details" aside={aside}>
      <dl className={summonsListClass}>{children}</dl>
    </CasePanel>
  );
}

/** Fields read from the summons. Key–value rows on mobile, a 3-column grid on desktop. */
export function SummonsPanel({ caseData: c }: { caseData: AdvocateCase }) {
  return (
    <SummonsPanelFrame
      aside={
        <Badge tone="accent" dot>
          Extracted
        </Badge>
      }
    >
      {summonsFields.map((f) => (
        <div key={f.label} className={summonsRowClass}>
          <dt className={summonsLabelClass}>{f.label}</dt>
          <dd className={cn("min-w-0 flex-1 text-text-primary", f.mono ? "font-mono" : "font-medium")}>{f.value(c)}</dd>
        </div>
      ))}
    </SummonsPanelFrame>
  );
}

/** Checklist of next steps with due dates. */
export function NextActionsPanel({ actions }: { actions: CaseAction[] }) {
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
            {a.href ? (
              <a
                href={a.href}
                className="shrink-0 text-12 leading-[1.4] font-medium whitespace-nowrap text-accent hover:underline"
              >
                {a.due}
              </a>
            ) : (
              <span
                className={cn(
                  "shrink-0 text-12 leading-[1.4] font-medium whitespace-nowrap",
                  a.urgent ? "text-warning-fg" : "text-text-tertiary",
                )}
              >
                {a.due}
              </span>
            )}
          </li>
        ))}
      </ul>
    </CasePanel>
  );
}

const activityListClass = "flex flex-col gap-4 p-3.5 lg:gap-3.5 lg:p-4";
const activityDotClass = "mt-[5px] size-2 shrink-0 rounded-full bg-border-strong";

/** Case timeline, oldest first. */
export function ActivityPanel({ events }: { events: ActivityEvent[] }) {
  return (
    <CasePanel title="Activity">
      {events.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity yet"
          description="Updates to this case, like lookups, shares and assignments, will show up here."
          className="py-8"
        />
      ) : (
        <ol className={activityListClass}>
          {events.map((e) => (
            <li key={`${e.title}-${e.meta}`} className="flex items-start gap-2.5">
              <span aria-hidden className={activityDotClass} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4] lg:leading-[1.45]">
                <span className="text-13 font-medium text-text-primary">{e.title}</span>
                <span className="text-12 text-text-tertiary">{e.meta}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </CasePanel>
  );
}

/* Loading states. The case reference isn't known until the data arrives, so the header says "Case". */

const caseTabLabels: { tab: CaseTab; label: string }[] = [
  { tab: "overview", label: "Overview" },
  { tab: "records", label: "Records" },
  { tab: "activity", label: "Activity" },
];

/**
 * Case detail frame while the case loads: generic "Case" header, placeholder title block,
 * `children` (the tab's skeleton panels) and a disabled footer.
 */
export function CaseDetailLoadingShell({ tab, children }: { tab: CaseTab; children: ReactNode }) {
  return (
    <>
      <ConsoleHeader
        breadcrumbs={[{ label: "Cases", href: "/advocate/cases" }, { label: "Case" }]}
        title="Case"
        backHref="/advocate/cases"
      />
      <LoadingRegion label="Loading case" className="flex min-w-0 flex-col">
        <CaseHeaderSkeleton tab={tab} />
        <PageBody className="gap-3 lg:pt-5">{children}</PageBody>
      </LoadingRegion>
      <CaseFooter />
    </>
  );
}

/** <CaseHeader> with placeholders for the reference, badges, address and parties. */
function CaseHeaderSkeleton({ tab }: { tab: CaseTab }) {
  return (
    <>
      <div className="flex flex-col gap-1.5 border-b border-border-default bg-bg-surface px-4 pt-1 lg:hidden">
        <div className="flex gap-1.5">
          <BadgeSkeleton className="w-28" />
          <BadgeSkeleton className="w-24" />
        </div>
        <LineSkeleton className="text-20 leading-[1.25]" barClassName="w-56" />
        <LineSkeleton className="text-13 leading-[1.4]" barClassName="w-64 max-w-full" />
        {/* Same look as <Tabs variant="underline">, but inert: the tab links need the case reference. */}
        <ul className="flex items-center gap-5 pt-2.5 whitespace-nowrap">
          {caseTabLabels.map((t) => (
            <li
              key={t.tab}
              className={cn(
                "flex border-b-2 pt-1.5 pb-2.5 text-14 leading-none",
                t.tab === tab ? "border-accent font-semibold text-accent" : "border-transparent font-medium text-text-secondary",
              )}
            >
              {t.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden flex-col gap-4 px-6 pt-6 lg:flex">
        <div className="flex items-end gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <LineSkeleton className="w-28 font-mono text-13 leading-[1.45]" />
              <BadgeSkeleton className="w-32" />
              <BadgeSkeleton className="w-36" />
            </div>
            <LineSkeleton className="text-24" barClassName="w-80" />
            <LineSkeleton className="text-14 leading-[1.45]" barClassName="w-96" />
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" size="sm" leadingIcon={Download} disabled>
              Export case PDF
            </Button>
            <Button size="sm" leadingIcon={FileText} disabled>
              Record certification
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Desktop view while loading. Hidden below `lg`, like <CaseDesktopView>. */
export function CaseDesktopViewSkeleton() {
  return (
    <div className="hidden lg:block">
      <CaseColumns
        aside={
          <>
            <NextActionsPanelSkeleton />
            <ActivityPanelSkeleton />
          </>
        }
      >
        <LicenseVerificationPanelSkeleton />
        <SummonsPanelSkeleton />
      </CaseColumns>
    </div>
  );
}

/** Mobile Overview tab while loading: result strip, hearing card, next actions. */
export function CaseOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      <Skeleton className="h-15 rounded-lg" />
      <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
        <Skeleton className="h-10 w-10 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
          <LineSkeleton className="text-14" barClassName="w-32" />
          <LineSkeleton className="text-12" barClassName="w-48" />
        </div>
      </div>
      <NextActionsPanelSkeleton />
    </div>
  );
}

function NextActionsPanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <CasePanel title="Next actions" aside={<LineSkeleton className="w-10 shrink-0 text-12 leading-[1.4]" />}>
      <ul className="lg:px-4 lg:py-1">
        {Array.from({ length: rows }, (_, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 border-b border-border-default px-3.5 py-2.75 last:border-b-0 lg:px-0 lg:py-2.5"
          >
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <LineSkeleton className="flex-1 text-13 leading-[1.4] lg:leading-[1.45]" barClassName={i % 2 ? "w-36" : "w-48"} />
            <LineSkeleton className="w-14 shrink-0 text-12 leading-[1.4]" />
          </li>
        ))}
      </ul>
    </CasePanel>
  );
}

/** Loading "Activity": dots and two lines per event. */
export function ActivityPanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <CasePanel title="Activity">
      <ol className={activityListClass}>
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span aria-hidden className={activityDotClass} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4] lg:leading-[1.45]">
              <LineSkeleton className="text-13" barClassName={i % 2 ? "w-40" : "w-52"} />
              <LineSkeleton className="text-12" barClassName="w-28" />
            </div>
          </li>
        ))}
      </ol>
    </CasePanel>
  );
}

const lookupMetaWidths = ["w-40", "w-36", "w-44"];

/** Loading "License verification": result strip, record placeholders and lookup details. */
export function LicenseVerificationPanelSkeleton() {
  return (
    <CasePanel
      title="License verification"
      aside={
        <>
          <Skeleton className="h-6 w-18 rounded-md lg:hidden" />
          <Button variant="secondary" size="sm" leadingIcon={RefreshCw} className="hidden lg:inline-flex" disabled>
            Re-run
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2.5 p-3.5 lg:hidden">
        <Skeleton className="h-10 rounded-lg" />
        <div className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-app p-3">
          <div className="flex items-center justify-between gap-2">
            <LineSkeleton className="w-32 text-13 leading-[1.4]" />
            <BadgeSkeleton className="w-18" />
          </div>
          <LineSkeleton className="text-12 leading-[1.4]" barClassName="w-56" />
        </div>
        {lookupMetaWidths.map((w) => (
          <LineSkeleton key={w} className="text-12 leading-[1.4]" barClassName={w} />
        ))}
      </div>

      <div className="hidden flex-col gap-3 p-4 lg:flex">
        <Skeleton className="h-11 rounded-md" />
        <Skeleton className="h-[82px] rounded-md" />
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {lookupMetaWidths.map((w) => (
            <LineSkeleton key={w} className="w-44 text-12 leading-[1.45]" barClassName={w} />
          ))}
        </div>
      </div>
    </CasePanel>
  );
}

/** Loading "Summons details": the real field labels with placeholder values. */
export function SummonsPanelSkeleton() {
  return (
    <SummonsPanelFrame aside={<BadgeSkeleton className="w-22" />}>
      {summonsFields.map((f, i) => (
        <div key={f.label} className={summonsRowClass}>
          <dt className={summonsLabelClass}>{f.label}</dt>
          <dd className="min-w-0 flex-1">
            <LineSkeleton barClassName={i % 2 ? "w-32" : "w-24"} />
          </dd>
        </div>
      ))}
    </SummonsPanelFrame>
  );
}
