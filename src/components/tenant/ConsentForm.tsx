"use client";

import { useActionState, useId, useState, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronDown, CircleAlert, Lock, Phone, ShieldCheck, Users } from "lucide-react";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { PageHeading } from "@/components/tenant/results/PageHeading";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { shareCase } from "@/lib/cases/actions";
import type { FormState } from "@/lib/validation/schemas";

export type ConsentOrg = {
  /** Organization slug, posted as `org`. */
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
};

/**
 * Consent to share a case with a legal aid organization. Posts to `shareCase`,
 * which redirects to the confirmation screen.
 */
export function ConsentForm({ orgs, items, defaultFirstName = "", defaultPhone = "", cancelHref }: ConsentFormProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(shareCase, {});
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? "");
  const [optional, setOptional] = useState<Record<string, boolean>>({});
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [phone, setPhone] = useState(defaultPhone);
  const [language, setLanguage] = useState("English");
  const [agreed, setAgreed] = useState(true);
  const org = orgs.find((candidate) => candidate.id === orgId) ?? orgs[0];
  const errors = state.fieldErrors ?? {};
  const errorOf = (name: string) => errors[name]?.[0];

  const actions = (
    <>
      <Link
        href={cancelHref}
        className={buttonClassName("secondary", "responsive", "min-w-0 flex-1 md:h-[46px] md:flex-none md:px-[18px]")}
      >
        Not now
      </Link>
      <SubmitButton
        pending={pending}
        icon={<Icon icon={Users} size={18} />}
        className={buttonClassName("primary", "responsive", "min-w-0 flex-1 md:h-[46px] md:flex-none md:px-[18px]")}
      >
        {pending ? "Sharing…" : "Share my case"}
      </SubmitButton>
    </>
  );

  return (
    <form action={formAction} noValidate className="flex flex-1 flex-col">
      <div className="flex flex-col gap-3.5 p-5 md:gap-5 md:p-0">
        <PageHeading
          title="Share your case with legal aid"
          description="A lawyer can review your case before your hearing and help you raise the license defense. Sharing is optional."
        />

        {(state.error || Object.keys(errors).length > 0) && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-danger-border bg-danger-bg p-3 text-13 leading-[1.45] text-danger-fg">
            <Icon icon={CircleAlert} size={16} className="mt-px" />
            {state.error ?? "Check the highlighted answers, then try again."}
          </p>
        )}

        <fieldset
          className={cn(panelClass, errorOf("org") && "border-danger-fg")}
          aria-invalid={errorOf("org") ? true : undefined}
          aria-describedby={errorOf("org") ? "org-error" : undefined}
        >
          <PanelLegend title="Choose an organization" subtitle="They provide free legal help to Baltimore City tenants." />
          {errorOf("org") && <FieldError id="org-error">{errorOf("org")}</FieldError>}
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
            <ContactField label="First name" error={errorOf("firstName")}>
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-invalid={describedBy ? true : undefined}
                  aria-describedby={describedBy}
                  name="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClass}
                />
              )}
            </ContactField>
            <ContactField
              label="Phone"
              error={errorOf("phone")}
              leadingIcon={<Icon icon={Phone} size={16} className="text-text-tertiary" />}
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-invalid={describedBy ? true : undefined}
                  aria-describedby={describedBy}
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
                  <option value="English">English</option>
                  <option value="Español">Español</option>
                </select>
              )}
            </ContactField>
          </div>
        </fieldset>

        <p className="flex items-start gap-2.5 rounded-lg border border-border-default bg-bg-app p-3 text-12 leading-[1.45] text-text-secondary md:hidden">
          <Icon icon={ShieldCheck} size={16} className="text-success-fg" />
          Only the organization you choose can see your case. If you don’t share, your case stays private and is
          deleted automatically after your hearing.
        </p>

        <div className="flex flex-col gap-1.5">
          <label
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-lg border bg-bg-surface p-3.5 text-13 leading-[1.5] text-text-primary md:rounded-[10px]",
              errorOf("consent") ? "border-danger-fg" : "border-border-default",
            )}
          >
            <SmallCheckbox
              name="consent"
              checked={agreed}
              aria-invalid={errorOf("consent") ? true : undefined}
              aria-describedby={errorOf("consent") ? "consent-error" : undefined}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-px"
            />
            <span className="min-w-0 flex-1">
              I agree to share this information with {org?.name} so they can contact me about my case. I can
              withdraw at any time, and my information will be deleted.
            </span>
          </label>
          {errorOf("consent") && <FieldError id="consent-error">{errorOf("consent")}</FieldError>}
        </div>

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

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 px-0.5 text-12 leading-[1.45] text-danger-fg">
      {children}
    </p>
  );
}

function ContactField({
  label,
  error,
  leadingIcon,
  trailingIcon,
  children,
}: {
  label: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Renders the control; `describedBy` is set when there's an error to point at. */
  children: (id: string, describedBy?: string) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-13 leading-[1.45] font-medium text-text-secondary">
        {label}
      </label>
      <div
        className={cn(
          "relative flex h-[46px] items-center gap-2 rounded-lg border bg-bg-surface px-3 md:h-11",
          error ? "border-[1.5px] border-danger-fg" : "border-border-strong",
          "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
        )}
      >
        {leadingIcon}
        {children(id, error ? errorId : undefined)}
        {trailingIcon && <span className="pointer-events-none absolute right-3 flex">{trailingIcon}</span>}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** Disabled + checked renders the grey "always shared" state. */
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
 * Loading state for `ConsentForm`: the real heading and panel titles, with
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
            Only the organization you choose can see your case. If you don’t share, your case stays private and is
            deleted automatically after your hearing.
          </p>

          <div className="flex items-start gap-2.5 rounded-lg border border-border-default bg-bg-surface p-3.5 md:rounded-[10px]">
            <Skeleton className="mt-px size-[18px] shrink-0 rounded-sm" />
            {/* Four lines on mobile, two from md, like the agreement text. */}
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
