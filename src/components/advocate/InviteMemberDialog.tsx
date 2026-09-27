"use client";

import { useActionState, useId, useRef, useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { inviteMember } from "@/lib/cases/advocate-actions";
import { advocateRoleLabels, advocateRoles, type FormState } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";
import { useConsoleSession } from "./ConsoleSession";
import { CopyButton } from "./CopyButton";

/**
 * "Invite member" button and dialog. `trigger`: a full-width button (mobile), the
 * console `sm` button (desktop page header), or a secondary "Invite a teammate"
 * button for the team list's empty state.
 *
 * Only admins see it. No email is sent: the dialog hands back a sign-up link to share.
 */
export function InviteMemberDialog({ trigger }: { trigger: "mobile" | "desktop" | "empty" }) {
  const { isAdmin } = useConsoleSession();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // A fresh form (and form state) every time the dialog opens.
  const [formKey, setFormKey] = useState(0);

  if (!isAdmin) return null;

  function open() {
    setFormKey((k) => k + 1);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      {trigger === "mobile" ? (
        <Button leadingIcon={Plus} onClick={open} className="h-11 w-full text-14">
          Invite member
        </Button>
      ) : trigger === "empty" ? (
        <Button variant="secondary" size="sm" leadingIcon={Plus} onClick={open}>
          Invite a teammate
        </Button>
      ) : (
        <Button size="sm" leadingIcon={Plus} onClick={open}>
          Invite member
        </Button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100%-32px)] max-w-110 rounded-xl border border-border-default bg-bg-surface p-0 text-text-primary shadow-card backdrop:bg-bg-inverse/40"
      >
        <div className="flex items-center gap-2 border-b border-border-default py-2 pr-2 pl-5">
          <h2 id={titleId} className="flex-1 text-16 font-semibold">
            Invite member
          </h2>
          <IconButton icon={X} label="Close" onClick={close} />
        </div>
        <InviteForm key={formKey} onDone={close} />
      </dialog>
    </>
  );
}

function InviteForm({ onDone }: { onDone: () => void }) {
  const { organization } = useConsoleSession();
  const roleId = useId();
  const roleErrorId = useId();
  const [state, formAction, pending] = useActionState<FormState, FormData>(inviteMember, {});
  const values = state.values ?? {};
  const roleError = state.fieldErrors?.role?.[0];

  if (state.ok && values.link) {
    return (
      <div className="flex flex-col gap-4 p-5">
        <p role="status" className="text-14 leading-[1.5] text-text-secondary">
          Invitation created for <span className="font-medium text-text-primary">{values.email}</span>. Send them this
          sign-up link. It expires after 7 days.
        </p>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${roleId}-link`} className="text-13 font-medium text-text-secondary">
            Invite link
          </label>
          <div className="flex gap-2">
            <input
              id={`${roleId}-link`}
              readOnly
              value={values.link}
              onFocus={(e) => e.currentTarget.select()}
              className="h-9 min-w-0 flex-1 rounded-md border border-border-strong bg-bg-subtle px-2.5 font-mono text-12 text-text-primary"
            />
            <CopyButton text={values.link} />
          </div>
        </div>
        <Button size="sm" onClick={onDone} className="self-end">
          Done
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 p-5" noValidate>
      <p className="text-13 leading-[1.4] text-text-secondary">
        They’ll be able to see cases tenants share with {organization}.
      </p>
      <Field
        label="Work email"
        name="email"
        type="email"
        required
        autoComplete="off"
        placeholder="name@example.org"
        defaultValue={values.email}
        error={state.fieldErrors?.email?.[0]}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor={roleId} className="text-13 font-medium text-text-secondary">
          Role
        </label>
        <div className="relative">
          <select
            id={roleId}
            name="role"
            defaultValue={values.role ?? advocateRoles[0]}
            aria-invalid={roleError ? true : undefined}
            aria-describedby={roleError ? roleErrorId : undefined}
            className={cn(
              "h-11 w-full appearance-none rounded-lg border bg-bg-surface pr-9 pl-3 text-15 text-text-primary",
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
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-tertiary"
          />
        </div>
        {roleError && (
          <p id={roleErrorId} className="text-12 text-danger-fg">
            {roleError}
          </p>
        )}
      </div>
      <Checkbox name="admin" defaultChecked={values.admin === "on"}>
        Admin: can invite and remove members
      </Checkbox>
      <div aria-live="polite">
        {state.error && (
          <p role="alert" className="text-13 leading-[1.4] font-medium text-danger-fg">
            {state.error}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={pending}>
          Create invite
        </Button>
      </div>
    </form>
  );
}
