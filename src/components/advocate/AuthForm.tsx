"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, Lock, ShieldCheck, Users } from "lucide-react";
import { AuthHeading, authLinkClass } from "@/components/advocate/auth/AuthHeading";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/*
 * Advocate sign in, invitation sign up and password reset forms (Figma 23–26, 54 and 56).
 * Nothing is submitted yet: each form shows its pending state briefly, then moves on to the next screen.
 */

// Inputs are 46px / 15px on mobile and 44px / 14px on desktop in these frames.
const authFieldClass =
  "[&>div:nth-child(2)]:h-[46px] lg:[&>div:nth-child(2)]:h-11 [&_input]:text-15 lg:[&_input]:text-14";
const submitClass = "w-full lg:h-11 lg:text-14";
const checkboxClass = "items-start gap-2 text-13 leading-[1.45] text-text-secondary";

type SubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

// Stand-in for the Supabase auth call; remove once the forms submit for real.
const SIMULATED_REQUEST_MS = 800;

/**
 * Submit handler plus a `pending` flag: while pending, the submit button shows a
 * spinner and the inputs are disabled. Pending stays on through navigation.
 */
function usePendingSubmit(href: string): { pending: boolean; onSubmit: SubmitHandler } {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const onSubmit: SubmitHandler = (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    // TODO: replace the delay with the Supabase request and handle its errors.
    window.setTimeout(() => router.push(href), SIMULATED_REQUEST_MS);
  };
  return { pending, onSubmit };
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

/** Figma 25 (mobile) and 23 (desktop). */
export function SignInForm() {
  const { pending, onSubmit } = usePendingSubmit("/advocate");
  const router = useRouter();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4.5">
      <AuthHeading title="Sign in to Standing">Use the work email your organization invited.</AuthHeading>
      <Field
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        defaultValue="jrivera@publicjustice.org"
        disabled={pending}
        className={authFieldClass}
      />
      <Field
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        defaultValue="demo-pass-12"
        badge={
          <Link href="/advocate/reset-password" className={cn(authLinkClass, "text-13 leading-[1.45]")}>
            Forgot password?
          </Link>
        }
        disabled={pending}
        className={authFieldClass}
      />
      <Checkbox name="remember" disabled={pending} className={checkboxClass}>
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
        onClick={() => router.push("/advocate")}
      >
        Sign in with SSO
      </Button>
      <InlineLink prompt="Have an invitation?" href="/advocate/sign-up">
        Create your account
      </InlineLink>
    </form>
  );
}

const roles = ["Staff attorney", "Paralegal", "Intake specialist", "Supervising attorney", "Administrator"];

/** Figma 26 (mobile) and 24 (desktop). */
export function SignUpForm() {
  const { pending, onSubmit } = usePendingSubmit("/advocate");
  const roleId = useId();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5 lg:gap-4.5">
      <AuthHeading title="Create your account">Finish setting up access for your organization.</AuthHeading>
      <p className="flex items-center gap-2.5 rounded-lg border border-accent-border bg-accent-subtle p-3 text-13 leading-[1.45] font-medium">
        <Icon icon={Users} size={18} className="text-accent" />
        M. Chen invited you to join Public Justice Center.
      </p>
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        defaultValue="Jordan Rivera"
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
        defaultValue="jrivera@publicjustice.org"
        trailingIcon={Lock}
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
            defaultValue={roles[0]}
            disabled={pending}
            className="h-full w-full cursor-pointer appearance-none disabled:cursor-not-allowed bg-transparent pr-9 pl-3 text-15 leading-none text-text-primary focus-visible:outline-none lg:text-14"
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <Icon icon={ChevronDown} size={16} className="pointer-events-none absolute right-3 text-text-tertiary" />
        </div>
      </div>
      <Field
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        minLength={12}
        placeholder="Create a password"
        disabled={pending}
        hint="At least 12 characters. Use a passphrase you don’t use elsewhere."
        className={cn(authFieldClass, "[&>p]:leading-[1.45]")}
      />
      <Checkbox name="agree" defaultChecked required disabled={pending} className={checkboxClass}>
        I agree to the Terms of Use and will keep tenant information confidential.
      </Checkbox>
      <Button type="submit" loading={pending} className={submitClass}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <InlineLink prompt="Already have an account?" href="/advocate/sign-in">
        Sign in
      </InlineLink>
    </form>
  );
}

/** Figma 56 (mobile) and 54 (desktop). */
export function ResetPasswordForm() {
  const { pending, onSubmit } = usePendingSubmit("/advocate/reset-password/sent");

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4.5">
      <AuthHeading title="Reset your password" className="gap-1.5 [&>h1]:leading-[1.2]">
        Enter your work email and we’ll send you a link to set a new password.
      </AuthHeading>
      <Field
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        defaultValue="jrivera@publicjustice.org"
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
