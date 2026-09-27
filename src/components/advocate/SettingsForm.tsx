import type { ReactNode } from "react";
import { ChevronDown, Lock, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { memberRoles } from "@/lib/mock/advocate";
import { Button } from "@/components/ui/Button";
import { Panel } from "./ConsolePage";

export const SETTINGS_FORM_ID = "advocate-settings";

/** Profile, organization, notifications and security (Figma frames 64 desktop, 65 mobile). */
export function SettingsForm() {
  return (
    <form id={SETTINGS_FORM_ID} className="flex flex-col gap-3.5 lg:gap-5">
      <SettingsPanel title="Profile">
        <FieldRow>
          <TextSetting label="Full name" name="fullName" defaultValue="Jordan Rivera" autoComplete="name" />
          <TextSetting label="Work email" name="email" defaultValue="jrivera@publicjustice.org" locked />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <label htmlFor="settings-role" className="text-13 leading-[1.4] font-medium text-text-secondary">
              Role
            </label>
            <div className="relative">
              <select
                id="settings-role"
                name="role"
                defaultValue="Staff attorney"
                className="h-10.5 w-full appearance-none rounded-lg border border-border-strong bg-bg-surface pr-9 pl-3 text-14 text-text-primary"
              >
                {memberRoles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <Icon
                icon={ChevronDown}
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary"
              />
            </div>
          </div>
        </FieldRow>
      </SettingsPanel>

      <SettingsPanel
        title="Organization"
        description="Shown to tenants when they choose who to share their case with."
        aside={<Badge tone="neutral">Admin only</Badge>}
      >
        <FieldRow>
          <TextSetting label="Organization name" name="orgName" defaultValue="Public Justice Center" locked />
          <TextSetting label="Callback number" name="callback" defaultValue="(410) 555-0100" locked />
          <TextSetting label="Languages" name="languages" defaultValue="English, Spanish" locked />
        </FieldRow>
      </SettingsPanel>

      <SettingsPanel title="Email notifications">
        <ul>
          <ToggleRow name="notifyShared" defaultChecked>
            A tenant shares a case with your organization
          </ToggleRow>
          <ToggleRow name="notifyHearing" defaultChecked>
            A hearing is 3 days away and certification isn’t recorded
          </ToggleRow>
          <ToggleRow name="notifyLookup">A license lookup fails</ToggleRow>
        </ul>
      </SettingsPanel>

      <SettingsPanel title="Security">
        <ul>
          <SecurityRow title="Password" detail="Last changed 3 days ago" action="Change" />
          <SecurityRow title="Single sign-on" detail="Not set up for your organization" action="Contact admin" />
        </ul>
      </SettingsPanel>

      <button
        type="button"
        className="flex items-center gap-2 self-start text-14 leading-[1.4] font-semibold text-danger-fg hover:underline"
      >
        <Icon icon={LogOut} size={16} />
        Sign out
      </button>

      <Button type="submit" className="h-11 w-full text-14 lg:hidden">
        Save changes
      </Button>
    </form>
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
};

function TextSetting({ label, name, defaultValue, locked = false, autoComplete }: TextSettingProps) {
  const id = `settings-${name}`;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-13 leading-[1.4] font-medium text-text-secondary">
        {label}
      </label>
      <div
        className={cn(
          "flex h-10.5 items-center gap-2 rounded-lg border border-border-strong px-3 focus-within:border-accent",
          locked ? "bg-bg-subtle" : "bg-bg-surface",
        )}
      >
        <input
          id={id}
          name={name}
          defaultValue={defaultValue}
          readOnly={locked}
          autoComplete={autoComplete}
          aria-describedby={locked ? `${id}-locked` : undefined}
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
    </div>
  );
}

/** Notification row with a 40×24 switch (a styled native checkbox). */
function ToggleRow({ name, defaultChecked, children }: { name: string; defaultChecked?: boolean; children: string }) {
  const id = `settings-${name}`;
  return (
    <li className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0">
      <label htmlFor={id} className="min-w-0 flex-1 text-14 leading-[1.4] text-text-primary">
        {children}
      </label>
      <span className="relative flex h-6 w-10 shrink-0">
        <input
          id={id}
          name={name}
          type="checkbox"
          role="switch"
          defaultChecked={defaultChecked}
          className="peer h-6 w-10 cursor-pointer appearance-none rounded-full bg-border-strong transition-colors checked:bg-accent"
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
    <li className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0">
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
