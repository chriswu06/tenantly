"use client";

import Link from "next/link";
import { useActionState, useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, CircleAlert, Lock, ShieldCheck, Users } from "lucide-react";
import { AuthHeading, authLinkClass } from "@/components/advocate/auth/AuthHeading";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { requestPasswordReset, signIn, signUp, updatePassword } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { advocateRoleLabels, advocateRoles, type AdvocateRole, type FormState } from "@/lib/validation/schemas";

/*
 * Advocate sign in, invitation sign up and password reset forms. Each submits to a
 * Server Action through useActionState: while it runs the button shows a spinner
 * and the inputs are disabled; errors come back under the fields.
 */

const authFieldClass =
  "[&>div:nth-child(2)]:h-[46px] lg:[&>div:nth-child(2)]:h-11 [&_input]:text-15 lg:[&_input]:text-14";
const submitClass = "w-full lg:h-11 lg:text-14";
const checkboxClass = "items-start gap-2 text-13 leading-[1.45] text-text-secondary";

const initialState: FormState = {};

function firstError(state: FormState, field: string) {
  return state.fieldErrors?.[field]?.[0];
}

/** Form-level error, announced when it appears. */
function FormError({ message }: { message?: string }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {message && (
        <p className="flex items-start gap-2 rounded-lg border border-danger-border bg-danger-bg p-3 text-13 leading-[1.45] text-danger-fg">
          <Icon icon={CircleAlert} size={16} className="mt-0.5" />
          {message}
        </p>
      )}
    </div>
  );
}

function InlineLink({ prompt, href, children }: { prompt: string; href: string; children: ReactNode }) {
  return (
    <p className="flex flex-wrap justify-center gap-1 text-13 leading-[1.45]">
      <span className="text-text-secondary">{prompt}</span>
      <Link href={href} className={authLinkClass}>
        {children}
      </Link>
    </p>
  );
}

export function SignInForm({ next, linkError }: { next?: string; linkError?: boolean }) {
  const [state, action, pending] = useActionState(signIn, initialState);
  const [ssoNote, setSsoNote] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-4.5" noValidate>
      <AuthHeading title="Sign in to Standing">Use the work email your organization invited.</AuthHeading>
      <FormError
        message={
          state.error ??
          (linkError ? "That link has expired or was already used. Sign in, or request a new reset link." : undefined)
        }
      />
      {next && <input type="hidden" name="next" value={next} />}
      <Field
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={firstError(state, "email")}
        disabled={pending}
        className={authFieldClass}
      />
      <Field
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        error={firstError(state, "password")}
        badge={
          <Link href="/advocate/reset-password" className={cn(authLinkClass, "text-13 leading-[1.45]")}>
            Forgot password?
          </Link>
        }
        disabled={pending}
        className={authFieldClass}
      />
      <Checkbox name="remember" defaultChecked disabled={pending} className={checkboxClass}>
        Keep me signed in on this device
      </Checkbox>
      <Button type="submit" loading={pending} className={submitClass}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex items-center gap-3" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-border-default" />
        <span aria-hidden className="text-12 leading-[1.45] text-text-tertiary">
          or
        </span>
        <span className="h-px flex-1 bg-border-default" />
      </div>
      <Button
        variant="secondary"
        leadingIcon={ShieldCheck}
        disabled={pending}
        className={submitClass}
        aria-describedby={ssoNote ? "sso-note" : undefined}
        onClick={() => setSsoNote(true)}
      >
        Sign in with SSO
      </Button>
      <p id="sso-note" aria-live="polite" className="-mt-2 text-center text-12 leading-[1.45] text-text-tertiary empty:hidden">
        {ssoNote ? "Single sign-on isn’t set up for your organization yet. Sign in with your email." : ""}
      </p>
      <InlineLink prompt="Have an invitation?" href="/advocate/sign-up">
        Create your account
      </InlineLink>
    </form>
  );
}

export type Invitation = {
  token: string;
  email: string;
  organizationName: string;
  inviterName: string | null;
  role: AdvocateRole;
};

/** Needs a valid invitation; the page checks it. */
export function SignUpForm({ invite }: { invite: Invitation }) {
  const [state, action, pending] = useActionState(signUp, initialState);
  const roleId = useId();
  const roleError = firstError(state, "role");

  return (
    <form action={action} className="flex flex-col gap-3.5 lg:gap-4.5" noValidate>
      <AuthHeading title="Create your account">Finish setting up access for your organization.</AuthHeading>
      <p className="flex items-center gap-2.5 rounded-lg border border-accent-border bg-accent-subtle p-3 text-13 leading-[1.45] font-medium">
        <Icon icon={Users} size={18} className="text-accent" />
        {invite.inviterName ? `${invite.inviterName} invited you` : "You’re invited"} to join {invite.organizationName}.
      </p>
      <FormError message={state.error} />
      <input type="hidden" name="invite" value={invite.token} />
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        required
        defaultValue={state.values?.name}
        error={firstError(state, "name")}
        disabled={pending}
        className={authFieldClass}
      />
      <Field
        label="Work email"
        type="email"
        name="email"
        readOnly
        aria-readonly
        disabled={pending}
        defaultValue={invite.email}
        trailingIcon={Lock}
        hint="Your invitation is for this address."
        className={cn(authFieldClass, "[&>div:nth-child(2)]:bg-bg-subtle [&_input]:text-text-secondary")}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor={roleId} className="text-13 font-medium text-text-secondary">
          Role
        </label>
        <div className="relative flex h-[46px] items-center rounded-lg border border-border-strong bg-bg-surface has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent has-disabled:bg-bg-subtle lg:h-11">
          <select
            id={roleId}
            name="role"
            defaultValue={state.values?.role || invite.role}
            disabled={pending}
            aria-invalid={roleError ? true : undefined}
            aria-describedby={roleError ? `${roleId}-error` : undefined}
            className="h-full w-full cursor-pointer appearance-none bg-transparent pr-9 pl-3 text-15 leading-none text-text-primary focus-visible:outline-none disabled:cursor-not-allowed lg:text-14"
          >
            {advocateRoles.map((role) => (
              <option key={role} value={role}>
                {advocateRoleLabels[role]}
              </option>
            ))}
          </select>
          <Icon icon={ChevronDown} size={16} className="pointer-events-none absolute right-3 text-text-tertiary" />
        </div>
        {roleError && (
          <p id={`${roleId}-error`} className="text-12 text-danger-fg">
            {roleError}
          </p>
        )}
      </div>
      <Field
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        minLength={12}
        required
        placeholder="Create a password"
        disabled={pending}
        error={firstError(state, "password")}
        hint="At least 12 characters. Use a passphrase you don’t use elsewhere."
        className={cn(authFieldClass, "[&>p]:leading-[1.45]")}
      />
      <Checkbox name="agree" required disabled={pending} className={checkboxClass}>
        I agree to the Terms of Use and will keep tenant information confidential.
      </Checkbox>
      {firstError(state, "agree") && <p className="-mt-2 text-12 text-danger-fg">{firstError(state, "agree")}</p>}
      <Button type="submit" loading={pending} className={submitClass}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <InlineLink prompt="Already have an account?" href="/advocate/sign-in">
        Sign in
      </InlineLink>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={action} className="flex flex-col gap-4.5" noValidate>
      <AuthHeading title="Reset your password" className="gap-1.5 [&>h1]:leading-[1.2]">
        Enter your work email and we’ll send you a link to set a new password.
      </AuthHeading>
      <Field
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={firstError(state, "email")}
        disabled={pending}
        className={authFieldClass}
      />
      <Button type="submit" loading={pending} className={cn(submitClass, "h-[46px]")}>
        {pending ? "Sending link…" : "Send reset link"}
      </Button>
      <Link
        href="/advocate/sign-in"
        className={cn(authLinkClass, "flex items-center justify-center gap-1.5 self-center text-13 leading-[1.45]")}
      >
        <Icon icon={ChevronLeft} size={16} />
        Back to sign in
      </Link>
    </form>
  );
}

/** After the reset email's link: choose a new password. */
export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={action} className="flex flex-col gap-4.5" noValidate>
      <AuthHeading title="Choose a new password" className="gap-1.5 [&>h1]:leading-[1.2]">
        Use at least 12 characters. You’ll stay signed in on this device.
      </AuthHeading>
      <FormError message={state.error} />
      <Field
        label="New password"
        type="password"
        name="password"
        autoComplete="new-password"
        minLength={12}
        required
        error={firstError(state, "password")}
        disabled={pending}
        className={authFieldClass}
      />
      <Field
        label="Confirm new password"
        type="password"
        name="confirm"
        autoComplete="new-password"
        required
        error={firstError(state, "confirm")}
        disabled={pending}
        className={authFieldClass}
      />
      <Button type="submit" loading={pending} className={cn(submitClass, "h-[46px]")}>
        {pending ? "Saving…" : "Save password"}
      </Button>
    </form>
  );
}
