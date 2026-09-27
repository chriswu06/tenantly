import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  CircleAlert,
  Download,
  ExternalLink,
  FileText,
  Folder,
  RefreshCw,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/tenant/scan/CopyButton";
import { FlowLayout } from "@/components/tenant/scan/FlowLayout";
import { GuidedCheckForm } from "@/components/tenant/scan/GuidedCheckForm";
import { dhcdRentalLicensingUrl } from "@/lib/contacts";
import { getTenantView, hearingInDays, lookupAddressOf } from "@/lib/cases/tenant";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Check the license yourself", robots: { index: false, follow: false } };

const DISCLAIMER =
  "Informational only, not legal advice. An official DHCD certification is required as evidence in court, whatever the lookup shows.";

type NextStep = { href: string; icon: LucideIcon; label: string; detail: string };

const nextSteps: NextStep[] = [
  { href: "/certification", icon: FileText, label: "Request DHCD certification", detail: "417 E Fayette St, Room 100" },
  { href: "/court-prep", icon: Folder, label: "Prepare court documents", detail: "6-item checklist" },
  { href: "/legal-help", icon: Scale, label: "Free legal assistance", detail: "Volunteer attorneys at court" },
];

// DHCD's registration page links to the city's license lookup.
const cityLookupUrl = dhcdRentalLicensingUrl;

const findingFor = { no_license: "none", expired: "expired", active: "active" } as const;

export default async function GuidedCheckPage() {
  const view = await getTenantView();
  const summaryPdfHref = `/api/cases/${view.reference}/report?type=summary`;
  const hearing = view.hearing;
  const lookupAddress = lookupAddressOf(view);
  const couldNotReach = view.licenseResult === "could_not_verify";
  const lastAttempt = couldNotReach && view.checkedAt ? `Last attempt ${view.checkedAt} · DHCD records did not respond` : null;
  const filed = view.filingDateIso
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
        new Date(`${view.filingDateIso}T00:00:00Z`),
      )
    : "the filing date";

  const lookupOptions = [
    { value: "none" as const, title: "No license shows up", detail: "Nothing matches the address" },
    { value: "expired" as const, title: "License is expired", detail: `End date is before ${filed}` },
    { value: "active" as const, title: "License is active", detail: "Status says active" },
  ];
  const previous = view.licenseResult in findingFor ? findingFor[view.licenseResult as keyof typeof findingFor] : undefined;

  return (
    <FlowLayout
      title="Results"
      backHref="/scan/review"
      step={3}
      width="wide"
      className="gap-2.5 px-5 py-4 md:gap-8 md:px-0 lg:flex-row lg:items-start"
      mobileFooter={
        <div className="flex items-center gap-2.5">
          <a href={summaryPdfHref} download
            aria-label="Download summary (PDF)"
            className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-bg-surface hover:bg-bg-subtle"
          >
            <Icon icon={Download} size={18} />
          </a>
          <Link href="/certification" className={buttonClassName("primary", "lg", "min-w-0 flex-1")}>
            Request certification
          </Link>
        </div>
      }
    >
      <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-5">
        {/* Result status */}
        <section className="flex flex-col gap-2.5 rounded-lg border border-danger-border bg-bg-surface p-4 md:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-danger-bg text-danger-fg">
              <Icon icon={CircleAlert} size={20} />
            </span>
            <Badge tone="danger" dot>
              Verification incomplete
            </Badge>
          </div>
          <h1 className="text-18 leading-[1.3] font-semibold tracking-[-0.18px]">
            {couldNotReach ? "We couldn’t reach DHCD records" : "Check the license on the city’s website"}
          </h1>
          <p className="text-14 leading-[1.45] text-text-secondary">
            {couldNotReach
              ? "This is not a negative result. Retry, or open the city lookup and follow the guided check."
              : "Open the city lookup and tell us what it shows. We’ll use it for your next steps."}
          </p>
        </section>

        {/* Mobile case summary */}
        <dl className="flex flex-col rounded-lg border border-border-default bg-bg-surface px-4 py-1 text-13 leading-[1.4] md:hidden">
          <div className="flex gap-3 border-b border-border-default py-2">
            <dt className="w-[110px] shrink-0 text-text-secondary">Hearing</dt>
            <dd className="min-w-0 flex-1 font-medium">{hearing?.dateTime ?? "Not entered"}</dd>
          </div>
          <div className="flex gap-3 py-2">
            <dt className="w-[110px] shrink-0 text-text-secondary">Reference</dt>
            <dd className="min-w-0 flex-1 font-mono">{view.reference}</dd>
          </div>
        </dl>

        {/* Retry */}
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3">
          <Link
            href="/verify"
            className={buttonClassName("secondary", "compact", "h-11 w-full text-14 md:h-9.5 md:w-auto md:text-13")}
          >
            <Icon icon={RefreshCw} size={16} />
            Retry automatic check
          </Link>
          {lastAttempt && (
            <p className="text-center text-12 text-text-tertiary md:min-w-0 md:flex-1 md:text-left md:leading-[1.45]">
              {lastAttempt}
            </p>
          )}
        </div>

        {/* Guided check */}
        <section
          aria-labelledby="guided-check"
          className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]"
        >
          <div className="flex flex-col gap-0.5 border-b border-border-default px-4 pt-3.5 pb-3 leading-[1.45]">
            <h2 id="guided-check" className="text-14 font-semibold">
              Check it yourself on the city’s website
            </h2>
            <p className="text-12 text-text-tertiary">
              Takes about 2 minutes. We’ll use what you find for your next steps.
            </p>
          </div>
          <ol>
            <GuidedStep number={1} title="Copy the property address">
              <div className="flex items-center gap-2 rounded-md border border-border-default bg-bg-app px-2.5 py-2">
                <p className="min-w-0 flex-1 font-mono text-13 leading-none">{lookupAddress}</p>
                <CopyButton value={lookupAddress} label="Copy the property address" />
              </div>
              <p className="text-12 leading-[1.45] text-text-tertiary">
                Search by street number and name only. Leave out the apartment number.
              </p>
            </GuidedStep>
            <GuidedStep number={2} title="Open the Baltimore City rental license lookup">
              <a
                href={cityLookupUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonClassName("secondary", "compact", "self-start")}
              >
                Open city lookup
                <Icon icon={ExternalLink} size={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <p className="text-12 leading-[1.45] text-text-tertiary">
                Opens in a new tab. Paste the address into the search box.
              </p>
            </GuidedStep>
            <li className="flex flex-col gap-2.5 px-4 pt-3.5 pb-4">
              <GuidedCheckForm
                options={lookupOptions}
                defaultValue={previous}
                legend={
                  <legend className="mb-2.5 flex items-center gap-3 text-14 leading-[1.45] font-semibold">
                    <StepNumber number={3} />
                    What do you see?
                  </legend>
                }
              />
            </li>
          </ol>
        </section>

        {/* Mobile next steps */}
        <nav
          aria-labelledby="next-steps-mobile"
          className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:hidden"
        >
          <h2 id="next-steps-mobile" className="border-b border-border-default px-4 py-3 text-14 leading-[1.4] font-semibold">
            Recommended next steps
          </h2>
          <ul>
            {nextSteps.map(({ href, icon, label }) => (
              <li key={href} className="border-b border-border-default">
                <NextStepLink href={href} icon={icon} label={label} className="py-[11px]" />
              </li>
            ))}
            <li>
              <NextStepLink href="/share" icon={Users} label="Share case with legal aid" accent className="py-[11px]" />
            </li>
          </ul>
        </nav>

        <p className="text-12 text-text-tertiary md:leading-[1.45]">{DISCLAIMER}</p>
      </div>

      {/* Web sidebar */}
      <aside className="hidden flex-col gap-4 md:flex lg:w-[360px] lg:shrink-0">
        {hearing && (
          <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-surface p-4">
            <span className="flex shrink-0 flex-col items-center rounded-lg border border-accent-border bg-accent-subtle px-2.5 py-1.5 font-semibold text-accent">
              <span className="text-11 leading-[1.2]">{hearing.month}</span>
              <span className="text-22 leading-[1.1]">{hearing.day}</span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
              <p className="text-14 font-semibold">{hearingInDays(hearing.daysAway)}</p>
              <p className="text-12 text-text-secondary">
                {hearing.dateTime} · {hearing.courtAddress}
              </p>
            </div>
          </div>
        )}

        <nav
          aria-labelledby="next-steps-web"
          className="flex flex-col overflow-hidden rounded-[10px] border border-border-default bg-bg-surface"
        >
          <h2
            id="next-steps-web"
            className="flex h-12 items-center border-b border-border-default px-4 text-14 leading-[1.45] font-semibold"
          >
            Recommended next steps
          </h2>
          <ul>
            {nextSteps.map((step) => (
              <li key={step.href} className="border-b border-border-default last:border-b-0">
                <NextStepLink {...step} className="py-3" />
              </li>
            ))}
          </ul>
        </nav>

        <section
          aria-labelledby="share-legal-aid"
          className="flex flex-col gap-2.5 rounded-[10px] border border-accent-border bg-accent-subtle p-4"
        >
          <h2 id="share-legal-aid" className="flex items-center gap-2 text-14 leading-[1.45] font-semibold">
            <Icon icon={Users} size={18} className="text-accent" />
            Want a lawyer to review this?
          </h2>
          <p className="text-13 leading-[1.45] text-text-secondary">
            Share your case with a legal aid organization and they can call you before your hearing.
          </p>
          <Link
            href="/share"
            className="flex h-10 items-center justify-center rounded-lg border border-accent-border bg-bg-surface text-14 font-semibold text-accent hover:bg-accent-subtle"
          >
            Share my case
          </Link>
        </section>

        <Link href="/certification" className={buttonClassName("primary", "md", "w-full")}>
          Request certification
        </Link>
        <a href={summaryPdfHref} download className={buttonClassName("secondary", "md", "w-full")}>
          <Icon icon={Download} size={18} />
          Download summary (PDF)
        </a>
      </aside>
    </FlowLayout>
  );
}

function StepNumber({ number }: { number: number }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-12 leading-none font-semibold text-accent">
      {number}
    </span>
  );
}

function GuidedStep({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 border-b border-border-default px-4 py-3.5">
      <StepNumber number={number} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-14 leading-[1.45] font-semibold">{title}</p>
        {children}
      </div>
    </li>
  );
}

function NextStepLink({
  href,
  icon,
  label,
  detail,
  accent = false,
  className,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  detail?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-3 px-4 hover:bg-bg-app", className)}>
      <Icon icon={icon} size={18} className={accent ? "text-accent" : "text-text-secondary"} />
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span
          className={cn(
            "text-14 leading-[1.4] font-medium md:leading-[1.45]",
            accent ? "text-accent" : "text-text-primary",
          )}
        >
          {label}
        </span>
        {detail && <span className="hidden text-12 leading-[1.45] text-text-tertiary md:block">{detail}</span>}
      </span>
      <Icon icon={ChevronRight} size={16} className="text-text-tertiary" />
    </Link>
  );
}
