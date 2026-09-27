"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { memberRoles } from "@/lib/mock/advocate";

/**
 * "Invite member" button and dialog. `trigger`: full-width 44px button (mobile, frame 63),
 * the console `sm` button (desktop page header, frame 62), or a secondary "Invite a teammate"
 * button for the team list's empty state. There’s no Figma frame for the dialog,
 * so it reuses the console's field and button styles. Nothing is sent yet.
 */
export function InviteMemberDialog({ trigger }: { trigger: "mobile" | "desktop" | "empty" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const roleId = useId();
  const [sentTo, setSentTo] = useState<string | null>(null);

  function open() {
    setSentTo(null);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setSentTo(typeof email === "string" ? email : null);
    event.currentTarget.reset();
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

        {sentTo ? (
          <div className="flex flex-col gap-4 p-5">
            <p role="status" className="text-14 leading-[1.5] text-text-secondary">
              Invitation sent to <span className="font-medium text-text-primary">{sentTo}</span>. It expires after 7
              days.
            </p>
            <Button size="sm" onClick={close} className="self-end">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4 p-5">
            <p className="text-13 leading-[1.4] text-text-secondary">
              They’ll be able to see cases tenants share with Public Justice Center.
            </p>
            <Field label="Work email" name="email" type="email" required placeholder="name@publicjustice.org" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor={roleId} className="text-13 font-medium text-text-secondary">
                Role
              </label>
              <div className="relative">
                <select
                  id={roleId}
                  name="role"
                  defaultValue={memberRoles[0]}
                  className="h-11 w-full appearance-none rounded-lg border border-border-strong bg-bg-surface pr-9 pl-3 text-15 text-text-primary"
                >
                  {memberRoles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <Icon
                  icon={ChevronDown}
                  size={16}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-tertiary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send invite
              </Button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
