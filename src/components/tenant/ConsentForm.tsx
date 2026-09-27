"use client";

import { useId, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Lock, Phone, ShieldCheck, Users } from "lucide-react";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { PageHeading } from "@/components/tenant/results/PageHeading";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";

export type ConsentOrg = {
  id: string;
  name: string;
  /** Mobile subtitle. */
  short: string;
  /** Desktop subtitle. */
  detail: string;
};

export type SharedItem = {
  id: string;
  label: string;
  /** Value shown under the label on desktop. */
  value: string;
  required: boolean;
};

type ConsentFormProps = {
  orgs: ConsentOrg[];
  items: SharedItem[];
  defaultFirstName?: string;
  defaultPhone?: string;
  /** Where "Not now" goes. */
  cancelHref: string;
  /** Confirmation route; the chosen org id is added as `?org=`. */
  confirmationPath: string;
};

/**
 * Consent to share a case with a legal aid organization (Figma 29 and 27).
 * Everything is local state; submitting navigates to the confirmation screen.
 */
export function ConsentForm({
  orgs,
  items,
  defaultFirstName = "",
  defaultPhone = "",
  cancelHref,
  confirmationPath,
}: ConsentFormProps) {
  const router = useRouter();
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? "");
  const [optional, setOptional] = useState<Record<string, boolean>>({});
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [phone, setPhone] = useState(defaultPhone);
  const [language, setLanguage] = useState("en");
  const [agreed, setAgreed] = useState(true);
  const org = orgs.find((candidate) => candidate.id === orgId) ?? orgs[0];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) return;
    // TODO: POST the consent and shared fields. Static build: go to the confirmation.
    router.push(`${confirmationPath}?org=${encodeURIComponent(orgId)}`);
  }

  const actions = (
    <>
      <Link
        href={cancelHref}
        className={buttonClassName("secondary", "responsive", "min-w-0 flex-1 md:h-[46px] md:flex-none md:px-[18px]")}
      >
        Not now
      </Link>
      <button
        type="submit"
        aria-disabled={!agreed || undefined}
        className={buttonClassName("primary", "responsive", cn("min-w-0 flex-1 md:h-[46px] md:flex-none md:px-[18px]", !agreed && "cursor-not-allowed opacity-50"))}
      >
        <Icon icon={Users} size={18} />
        Share my case
      </button>
    </>
  );

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <div className="flex flex-col gap-3.5 p-5 md:gap-5 md:p-0">
        <PageHeading
          title="Share your case with legal aid"
          description="A lawyer can review your case before your hearing and help you raise the license defense. Sharing is optional."
        />

        <fieldset className={panelClass}>
          <PanelLegend title="Choose an organization" subtitle="They provide free legal help to Baltimore City tenants." />
          {orgs.map((candidate) => {
            const selected = candidate.id === orgId;
            return (
              <label
                key={candidate.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 border-b border-border-default px-3.5 py-3 last:border-b-0 md:px-4",
                  "has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-accent",
                  selected ? "bg-accent-subtle" : "hover:bg-bg-app",
                )}
              >
                <input
                  type="radio"
                  name="org"
                  value={candidate.id}
                  checked={selected}
                  onChange={() => setOrgId(candidate.id)}
                  className="size-[18px] shrink-0 appearance-none rounded-full border-[1.5px] border-border-strong bg-bg-surface checked:border-[5.5px] checked:border-accent focus-visible:outline-none"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.45]">
                  <span className={cn("text-14", selected ? "font-semibold text-accent" : "font-medium text-text-primary")}>
                    {candidate.name}
                  </span>
                  <span className="text-12 text-text-tertiary">
                    <span className="md:hidden">{candidate.short}</span>
                    <span className="hidden md:inline">{candidate.detail}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <fieldset className={panelClass}>
          <PanelLegend title="What will be shared" subtitle="Only what a lawyer needs to review your case." />
          {items.map((item) => {
            const checked = item.required || Boolean(optional[item.id]);
            return (
              <label
                key={item.id}
                className={cn(
                  "flex items-center gap-3 border-b border-border-default px-3.5 py-2.5 md:px-4 md:py-[11px]",
                  !item.required && "cursor-pointer hover:bg-bg-app",
                )}
              >
                <SmallCheckbox
                  checked={checked}
                  disabled={item.required}
                  onChange={(event) => setOptional((current) => ({ ...current, [item.id]: event.target.checked }))}
                />
                <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.45]">
                  <span className="text-13 font-medium text-text-primary">{item.label}</span>
                  <span className="hidden text-12 text-text-tertiary md:block">{item.value}</span>
                </span>
                <span className="shrink-0 text-12 leading-[1.45] whitespace-nowrap text-text-tertiary">
                  {item.required ? "Required" : "Optional"}
                </span>
              </label>
            );
          })}
          <p className="flex items-center gap-2 bg-bg-app px-3.5 py-2.5 text-12 leading-[1.45] text-text-tertiary md:px-4 md:py-[11px]">
            <Icon icon={Lock} size={14} />
            Your anonymous court outcome report is never linked to your case.
          </p>
        </fieldset>

        <fieldset className={panelClass}>
          <PanelLegend title="How should they contact you?" />
          <div className="flex flex-col gap-3 p-3.5 md:flex-row md:p-4">
            <ContactField label="First name">
              {(id) => (
                <input
                  id={id}
                  name="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClass}
                />
              )}
            </ContactField>
            <ContactField label="Phone" leadingIcon={<Icon icon={Phone} size={16} className="text-text-tertiary" />}>
              {(id) => (
                <input
                  id={id}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={inputClass}
                />
              )}
            </ContactField>
            <ContactField
              label="Language"
              trailingIcon={<Icon icon={ChevronDown} size={16} className="pointer-events-none text-text-tertiary" />}
            >
              {(id) => (
                <select
                  id={id}
                  name="language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className={cn(inputClass, "cursor-pointer appearance-none")}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              )}
            </ContactField>
          </div>
        </fieldset>

        <p className="flex items-start gap-2.5 rounded-lg border border-border-default bg-bg-app p-3 text-12 leading-[1.45] text-text-secondary md:hidden">
          <Icon icon={ShieldCheck} size={16} className="text-success-fg" />
          Only the organization you choose can see your case. If you don’t share, nothing is saved after you
          leave this page.
        </p>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border-default bg-bg-surface p-3.5 text-13 leading-[1.5] text-text-primary md:rounded-[10px]">
          <SmallCheckbox
            checked={agreed}
            required
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-px"
          />
          <span className="min-w-0 flex-1">
            I agree to share this information with {org?.name} so they can contact me about my case. I can
            withdraw at any time, and my information will be deleted.
          </span>
        </label>

        <div className="hidden justify-end gap-3 md:flex">{actions}</div>
      </div>

      <MobileActionBar>{actions}</MobileActionBar>
    </form>
  );
}

const panelClass =
  "flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]";

const panelHeadingClass =
  "flex flex-col gap-0.5 border-b border-border-default px-3.5 pt-3 pb-2.5 leading-[1.45] md:px-4 md:pt-3.5 md:pb-3";

const inputClass =
  "h-full min-w-0 flex-1 bg-transparent text-15 leading-none text-text-primary focus-visible:outline-none md:text-14";

function PanelLegend({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    // A <legend> can't take flex layout reliably, so the visible header is a div and the legend is visually hidden.
    <>
      <legend className="sr-only">{title}</legend>
      <div aria-hidden className={panelHeadingClass}>
        <span className="text-14 font-semibold text-text-primary">{title}</span>
        {subtitle && <span className="hidden text-12 text-text-tertiary md:block">{subtitle}</span>}
      </div>
    </>
  );
}

function ContactField({
  label,
  leadingIcon,
  trailingIcon,
  children,
}: {
  label: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-13 leading-[1.45] font-medium text-text-secondary">
        {label}
      </label>
      <div
        className={cn(
          "relative flex h-[46px] items-center gap-2 rounded-lg border border-border-strong bg-bg-surface px-3 md:h-11",
          "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
        )}
      >
        {leadingIcon}
        {children(id)}
        {trailingIcon && <span className="pointer-events-none absolute right-3 flex">{trailingIcon}</span>}
      </div>
    </div>
  );
}

/** 18px checkbox from the share frames. Disabled + checked renders the grey "always shared" state. */
function SmallCheckbox({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  return (
    <span className={cn("relative flex size-[18px] shrink-0", className)}>
      <input
        type="checkbox"
        className={cn(
          "peer size-[18px] cursor-pointer appearance-none rounded-sm border-[1.5px] border-border-strong bg-bg-surface transition-colors",
          "checked:border-accent checked:bg-accent",
          "disabled:cursor-default disabled:checked:border-border-strong disabled:checked:bg-border-strong",
        )}
        {...props}
      />
      <Check
        size={13}
        strokeWidth={2.5}
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto hidden text-text-inverse peer-checked:block"
      />
    </span>
  );
}

/**
 * Loading stand-in for `ConsentForm`: the real heading and panel titles, with
 * placeholders for the organizations, shared items and contact values. The
 * actions show but stay disabled until the form loads.
 */
export function ConsentFormSkeleton() {
  const actions = (
    <>
      <Button disabled variant="secondary" size="responsive" className={skeletonActionClass}>
        Not now
      </Button>
      <Button disabled size="responsive" leadingIcon={Users} className={skeletonActionClass}>
        Share my case
      </Button>
    </>
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-3.5 p-5 md:gap-5 md:p-0">
        <PageHeading
          title="Share your case with legal aid"
          description="A lawyer can review your case before your hearing and help you raise the license defense. Sharing is optional."
        />

        <div aria-hidden className="contents">
          <div className={panelClass}>
            <PanelHeadingText title="Choose an organization" subtitle="They provide free legal help to Baltimore City tenants." />
            {["w-40", "w-36", "w-60"].map((width) => (
              <div key={width} className="flex items-center gap-3 border-b border-border-default px-3.5 py-3 last:border-b-0 md:px-4">
                <Skeleton className="size-[18px] shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <div className="flex h-[20.3px] items-center">
                    <Skeleton className={cn("h-3.5 max-w-full", width)} />
                  </div>
                  <div className="flex h-[17.4px] items-center">
                    <Skeleton className="h-3 w-32 md:w-52" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={panelClass}>
            <PanelHeadingText title="What will be shared" subtitle="Only what a lawyer needs to review your case." />
            {["w-28", "w-44", "w-28", "w-32", "w-36"].map((width, index) => (
              <div key={index} className="flex items-center gap-3 border-b border-border-default px-3.5 py-2.5 md:px-4 md:py-[11px]">
                <Skeleton className="size-[18px] shrink-0 rounded-sm" />
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <div className="flex h-[18.2px] items-center">
                    <Skeleton className={cn("h-3 max-w-full", width)} />
                  </div>
                  <div className="hidden h-[16.8px] items-center md:flex">
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="flex h-[17.4px] items-center">
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
            <p className="flex items-center gap-2 bg-bg-app px-3.5 py-2.5 text-12 leading-[1.45] text-text-tertiary md:px-4 md:py-[11px]">
              <Icon icon={Lock} size={14} />
              Your anonymous court outcome report is never linked to your case.
            </p>
          </div>

          <div className={panelClass}>
            <PanelHeadingText title="How should they contact you?" />
            <div className="flex flex-col gap-3 p-3.5 md:flex-row md:p-4">
              {["First name", "Phone", "Language"].map((label) => (
                <div key={label} className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="text-13 leading-[1.45] font-medium text-text-secondary">{label}</span>
                  <Skeleton className="h-[46px] rounded-lg md:h-11" />
                </div>
              ))}
            </div>
          </div>

          <p className="flex items-start gap-2.5 rounded-lg border border-border-default bg-bg-app p-3 text-12 leading-[1.45] text-text-secondary md:hidden">
            <Icon icon={ShieldCheck} size={16} className="text-success-fg" />
            Only the organization you choose can see your case. If you don’t share, nothing is saved after you
            leave this page.
          </p>

          <div className="flex items-start gap-2.5 rounded-lg border border-border-default bg-bg-surface p-3.5 md:rounded-[10px]">
            <Skeleton className="mt-px size-[18px] shrink-0 rounded-sm" />
            {/* 13px/19.5px agreement text: four lines on mobile, two from md. */}
            <SkeletonText lines={4} lineClassName="h-[13px]" className="min-w-0 flex-1 gap-[6.5px] py-[3.25px] md:hidden" />
            <SkeletonText lines={2} lineClassName="h-[13px]" className="hidden min-w-0 flex-1 gap-[6.5px] py-[3.25px] md:flex" />
          </div>
        </div>

        <div className="hidden justify-end gap-3 md:flex">{actions}</div>
      </div>

      <MobileActionBar>{actions}</MobileActionBar>
    </div>
  );
}

const skeletonActionClass = "min-w-0 flex-1 md:h-[46px] md:flex-none md:px-[18px]";

/** Same header as `PanelLegend`, for the loading state (no fieldset around it). */
function PanelHeadingText({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={panelHeadingClass}>
      <span className="text-14 font-semibold text-text-primary">{title}</span>
      {subtitle && <span className="hidden text-12 text-text-tertiary md:block">{subtitle}</span>}
    </div>
  );
}
