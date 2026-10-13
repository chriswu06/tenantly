"use client";

import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, CircleCheck, Lock, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-actions";
import { updateSettings } from "@/lib/cases/advocate-actions";
import { advocateRoleLabels, advocateRoles, type AdvocateRole, type FormState } from "@/lib/validation/schemas";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { LineSkeleton, PageHeader, Panel } from "./ConsolePage";

export const SETTINGS_FORM_ID = "advocate-settings";

const ORGANIZATION_DESCRIPTION = "Shown to tenants when they choose who to share their case with.";

const notificationLabels = {
  notifyShared: "A tenant shares a case with your organization",
  notifyHearing: "A hearing is 3 days away and certification isn’t recorded",
  notifyLookup: "A license lookup fails",
} as const;

/** Desktop page title with the save button. */
export function SettingsPageHeader() {
  return (
    <PageHeader
      title="Settings"
      description="Your profile, notifications and security."
      actions={
        <Button type="submit" form={SETTINGS_FORM_ID} size="sm">
          Save changes
        </Button>
      }
    />
  );
}

export type SettingsValues = {
  fullName: string;
  email: string;
  role: AdvocateRole;
  notify: { shared: boolean; hearing: boolean; lookup: boolean };
  isAdmin: boolean;
  organization: {
    name: string;
    description: string | null;
    callbackPhone: string | null;
    languages: string | null;
    acceptsReferrals: boolean;
  };
};

export function SettingsForm({ settings }: { settings: SettingsValues }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateSettings, {});
  // After a failed save, keep what was typed; otherwise show what's saved.
  const values = state.values;
  const fullNameError = state.fieldErrors?.fullName?.[0];
  const roleError = state.fieldErrors?.role?.[0];
  const checked = (name: string, saved: boolean) => (values ? values[name] === "on" : saved);

  return (
    <form id={SETTINGS_FORM_ID} action={formAction} noValidate className="flex flex-col gap-3.5 lg:gap-5">
      <div aria-live="polite" className="empty:hidden">
        {state.ok && !pending && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-lg border border-success-border bg-success-bg p-3 text-13 leading-[1.4] font-medium text-success-fg"
          >
            <Icon icon={CircleCheck} size={16} />
            Settings saved.
          </p>
        )}
        {state.error && (
          <p role="alert" className="rounded-lg border border-danger-border bg-danger-bg p-3 text-13 font-medium text-danger-fg">
            {state.error}
          </p>
        )}
      </div>

      <SettingsPanel title="Profile">
        <FieldRow>
          <TextSetting
            label="Full name"
            name="fullName"
            defaultValue={values?.fullName ?? settings.fullName}
            autoComplete="name"
            error={fullNameError}
          />
          <TextSetting label="Work email" name="email" defaultValue={settings.email} locked />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <label htmlFor="settings-role" className="text-13 leading-[1.4] font-medium text-text-secondary">
              Role
            </label>
            <div className="relative">
              <select
                id="settings-role"
                name="role"
                defaultValue={values?.role ?? settings.role}
                aria-invalid={roleError ? true : undefined}
                aria-describedby={roleError ? "settings-role-error" : undefined}
                className={cn(
                  "h-10.5 w-full appearance-none rounded-lg border bg-bg-surface pr-9 pl-3 text-14 text-text-primary",
                  roleError ? "border-[1.5px] border-danger-fg" : "border-border-strong",
                )}
              >
                {advocateRoles.map((r) => (
                  <option key={r} value={r}>
                    {advocateRoleLabels[r]}
                  </option>
                ))}
              </select>
              <Icon
                icon={ChevronDown}
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary"
              />
            </div>
            {roleError && (
              <p id="settings-role-error" className="text-12 text-danger-fg">
                {roleError}
              </p>
            )}
          </div>
        </FieldRow>
      </SettingsPanel>

      <SettingsPanel
        title="Organization"
        description={ORGANIZATION_DESCRIPTION}
        aside={<Badge tone="neutral">Admin only</Badge>}
      >
        <OrganizationFields settings={settings} values={values} errors={state.fieldErrors} checked={checked} />
      </SettingsPanel>

      <SettingsPanel title="Email notifications">
        <ul>
          <ToggleRow name="notifyShared" defaultChecked={checked("notifyShared", settings.notify.shared)}>
            {notificationLabels.notifyShared}
          </ToggleRow>
          <ToggleRow name="notifyHearing" defaultChecked={checked("notifyHearing", settings.notify.hearing)}>
            {notificationLabels.notifyHearing}
          </ToggleRow>
          <ToggleRow name="notifyLookup" defaultChecked={checked("notifyLookup", settings.notify.lookup)}>
            {notificationLabels.notifyLookup}
          </ToggleRow>
        </ul>
      </SettingsPanel>

      <SettingsPanel title="Security">
        <ul>
          <li className={rowClass}>
            <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
              <p className="text-14 font-medium text-text-primary">Password</p>
              <p className="text-12 text-text-tertiary">We’ll email you a link to set a new one</p>
            </div>
            <Link href="/advocate/reset-password" className={buttonClassName("secondary", "sm")}>
              Change
            </Link>
          </li>
          <SecurityRow title="Single sign-on" detail="Not set up for your organization" action="Contact admin" />
        </ul>
      </SettingsPanel>

      <FormFooter pending={pending} />
    </form>
  );
}

/** Editable for admins; everyone else sees the saved values, locked. */
function OrganizationFields({
  settings,
  values,
  errors,
  checked,
}: {
  settings: SettingsValues;
  values: FormState["values"];
  errors: FormState["fieldErrors"];
  checked: (name: string, saved: boolean) => boolean;
}) {
  const org = settings.organization;
  const locked = !settings.isAdmin;
  const shown = (name: string, saved: string | null) => values?.[name] ?? (locked ? saved || "Not set" : (saved ?? ""));
  return (
    <>
      <FieldRow>
        <TextSetting
          label="Organization name"
          name="orgName"
          defaultValue={shown("orgName", org.name)}
          locked={locked}
          error={errors?.orgName?.[0]}
        />
        <TextSetting
          label="Callback number"
          name="callback"
          type="tel"
          defaultValue={shown("callback", org.callbackPhone)}
          locked={locked}
          error={errors?.callback?.[0]}
        />
        <TextSetting label="Languages" name="languages" defaultValue={org.languages ?? "Not set"} locked />
      </FieldRow>
      <div className="px-4 pb-4">
        <TextSetting
          label="Description"
          name="orgDescription"
          defaultValue={shown("orgDescription", org.description)}
          placeholder="Tenant advocacy · Responds by phone"
          hint="One short line tenants see under your name."
          locked={locked}
          error={errors?.orgDescription?.[0]}
        />
      </div>
      <ul className="border-t border-border-default">
        <ToggleRow
          name="acceptsReferrals"
          defaultChecked={checked("acceptsReferrals", org.acceptsReferrals)}
          disabled={locked}
          detail="When off, tenants won’t see your organization when they share a case."
        >
          Accepting cases from tenants
        </ToggleRow>
      </ul>
    </>
  );
}

/**
 * "Sign out" and the mobile save button. Inside the settings form, "Sign out" submits to the
 * signOut action instead (formAction), so it needs no form of its own.
 */
function FormFooter({ pending = false, inert = false }: { pending?: boolean; inert?: boolean }) {
  return (
    <>
      <button
        type={inert ? "button" : "submit"}
        formAction={inert ? undefined : signOut}
        formNoValidate
        className="flex items-center gap-2 self-start text-14 leading-[1.4] font-semibold text-danger-fg hover:underline"
      >
        <Icon icon={LogOut} size={16} />
        Sign out
      </button>

      <Button type={inert ? "button" : "submit"} loading={pending} disabled={inert} className="h-11 w-full text-14 lg:hidden">
        Save changes
      </Button>
    </>
  );
}

/** Settings while they load: the real panels and labels, placeholders for the saved values. */
export function SettingsFormSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 lg:gap-5">
      <SettingsPanel title="Profile">
        <FieldRow>
          <FieldSkeleton label="Full name" />
          <FieldSkeleton label="Work email" />
          <FieldSkeleton label="Role" />
        </FieldRow>
      </SettingsPanel>

      <SettingsPanel
        title="Organization"
        description={ORGANIZATION_DESCRIPTION}
        aside={<Badge tone="neutral">Admin only</Badge>}
      >
        <FieldRow>
          <FieldSkeleton label="Organization name" />
          <FieldSkeleton label="Callback number" />
          <FieldSkeleton label="Languages" />
        </FieldRow>
        <div className="px-4 pb-4">
          <FieldSkeleton label="Description" />
        </div>
        <ul className="border-t border-border-default">
          <li className={rowClass}>
            <p className="min-w-0 flex-1 text-14 leading-[1.4] text-text-primary">Accepting cases from tenants</p>
            <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
          </li>
        </ul>
      </SettingsPanel>

      <SettingsPanel title="Email notifications">
        <ul>
          {Object.values(notificationLabels).map((label) => (
            <li key={label} className={rowClass}>
              <p className="min-w-0 flex-1 text-14 leading-[1.4] text-text-primary">{label}</p>
              <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
            </li>
          ))}
        </ul>
      </SettingsPanel>

      <SettingsPanel title="Security">
        <ul>
          {["Password", "Single sign-on"].map((title) => (
            <li key={title} className={rowClass}>
              <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
                <p className="text-14 font-medium text-text-primary">{title}</p>
                <LineSkeleton className="text-12" barClassName="w-40" />
              </div>
              <Skeleton className="h-9 w-20 shrink-0" />
            </li>
          ))}
        </ul>
      </SettingsPanel>

      <FormFooter inert />
    </div>
  );
}

const rowClass = "flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0";

/** A field's real label over a grey input. */
function FieldSkeleton({ label }: { label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <p className="text-13 leading-[1.4] font-medium text-text-secondary">{label}</p>
      <Skeleton className="h-10.5 rounded-lg" />
    </div>
  );
}

function SettingsPanel({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Panel>
      <div className="flex items-center gap-2 border-b border-border-default px-4 pt-3.5 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4]">
          <h2 className="text-14 font-semibold text-text-primary">{title}</h2>
          {description && <p className="text-12 text-text-tertiary">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </Panel>
  );
}

/** Stacked on mobile, three columns on desktop. */
function FieldRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3.5 p-4 lg:flex-row lg:items-start">{children}</div>;
}

type TextSettingProps = {
  label: string;
  name: string;
  defaultValue: string;
  /** Read-only, on a grey fill with a lock icon. */
  locked?: boolean;
  autoComplete?: string;
  type?: "text" | "tel";
  placeholder?: string;
  hint?: string;
  error?: string;
};

function TextSetting({
  label,
  name,
  defaultValue,
  locked = false,
  autoComplete,
  type = "text",
  placeholder,
  hint,
  error,
}: TextSettingProps) {
  const id = `settings-${name}`;
  const describedBy =
    [locked && `${id}-locked`, hint && !locked && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-13 leading-[1.4] font-medium text-text-secondary">
        {label}
      </label>
      <div
        className={cn(
          "flex h-10.5 items-center gap-2 rounded-lg border px-3 focus-within:border-accent",
          error ? "border-[1.5px] border-danger-fg" : "border-border-strong",
          locked ? "bg-bg-subtle" : "bg-bg-surface",
        )}
      >
        <input
          id={id}
          // Locked fields are for show; they aren't part of the saved settings.
          name={locked ? undefined : name}
          type={type}
          defaultValue={defaultValue}
          placeholder={locked ? undefined : placeholder}
          readOnly={locked}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-14 leading-none outline-none",
            locked ? "text-text-secondary" : "text-text-primary",
          )}
        />
        {locked && (
          <>
            <Icon icon={Lock} size={14} className="text-text-tertiary" />
            <span id={`${id}-locked`} className="sr-only">
              Locked
            </span>
          </>
        )}
      </div>
      {hint && !locked && !error && (
        <p id={`${id}-hint`} className="text-12 text-text-tertiary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-12 text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}

/** Notification row with a switch (a styled native checkbox). */
function ToggleRow({
  name,
  defaultChecked,
  disabled = false,
  detail,
  children,
}: {
  name: string;
  defaultChecked?: boolean;
  /** Shows the saved state without submitting it. */
  disabled?: boolean;
  detail?: string;
  children: string;
}) {
  const id = `settings-${name}`;
  return (
    <li className={rowClass}>
      <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
        <label htmlFor={id} className="text-14 text-text-primary">
          {children}
        </label>
        {detail && (
          <p id={`${id}-detail`} className="text-12 text-text-tertiary">
            {detail}
          </p>
        )}
      </div>
      <span className="relative flex h-6 w-10 shrink-0">
        <input
          id={id}
          name={name}
          type="checkbox"
          role="switch"
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-describedby={detail ? `${id}-detail` : undefined}
          className="peer h-6 w-10 cursor-pointer appearance-none rounded-full bg-border-strong transition-colors checked:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full bg-bg-surface shadow-card transition-transform peer-checked:translate-x-4"
        />
      </span>
    </li>
  );
}

function SecurityRow({ title, detail, action }: { title: string; detail: string; action: string }) {
  return (
    <li className={rowClass}>
      <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
        <p className="text-14 font-medium text-text-primary">{title}</p>
        <p className="text-12 text-text-tertiary">{detail}</p>
      </div>
      <Button variant="secondary" size="sm">
        {action}
      </Button>
    </li>
  );
}
