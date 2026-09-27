"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, CircleAlert, Lock } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { OutcomeOption } from "@/types/case";
import { MobileActionBar } from "./MobileActionBar";
import { Button, buttonClassName } from "@/components/ui/Button";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { reportOutcome } from "@/lib/cases/actions";
import type { FormState } from "@/lib/validation/schemas";
import { Skeleton } from "@/components/ui/Skeleton";

const options: { value: OutcomeOption; label: string }[] = [
  { value: "raised_license_defense", label: "Raised the license defense" },
  { value: "case_dismissed", label: "Case dismissed" },
  { value: "case_postponed", label: "Case postponed" },
  { value: "did_not_raise_defense", label: "Did not raise the defense" },
  { value: "did_not_attend", label: "Did not attend" },
];

/**
 * Anonymous hearing outcome report (Figma 10 and 22). Mobile: full screen with
 * a bottom action bar. Desktop: centered 560px card. Posts to `reportOutcome`,
 * then thanks the tenant.
 */
export function OutcomeForm({ defaultValue }: { defaultValue?: OutcomeOption | null }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(reportOutcome, {});
  const [outcome, setOutcome] = useState<OutcomeOption>(defaultValue ?? "raised_license_defense");
  const error = state.error ?? state.fieldErrors?.outcome?.[0];

  if (state.ok) return <OutcomeThanks />;

  const submitButton = (className: string) => (
    <SubmitButton pending={pending} className={buttonClassName("primary", "responsive", className)}>
      {pending ? "Sending…" : "Submit anonymously"}
    </SubmitButton>
  );

  return (
    <form action={formAction} className="flex flex-1 flex-col md:items-center md:px-6 md:pt-14 md:pb-12">
      <div className="flex flex-1 flex-col gap-3.5 p-5 md:w-full md:max-w-[560px] md:flex-none md:gap-5 md:rounded-xl md:border md:border-border-default md:bg-bg-surface md:p-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-22 leading-[1.25] font-semibold text-text-primary md:text-24 md:leading-[1.25]">
            How did your hearing go?
          </h1>
          <p id="outcome-hint" className="text-15 leading-[1.45] text-text-secondary">
            Anonymous. Used only to measure how often the license defense is raised.
          </p>
        </div>

        <fieldset
          aria-describedby={error ? "outcome-hint outcome-error" : "outcome-hint"}
          aria-invalid={error ? true : undefined}
          className="overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]"
        >
          <legend className="sr-only">Hearing outcome</legend>
          {options.map((option) => {
            const selected = outcome === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 border-b border-border-default px-4 py-3.5 last:border-b-0",
                  "has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-accent",
                  selected ? "bg-accent-subtle" : "hover:bg-bg-app",
                )}
              >
                <input
                  type="radio"
                  name="outcome"
                  value={option.value}
                  checked={selected}
                  onChange={() => setOutcome(option.value)}
                  className="size-[18px] shrink-0 appearance-none rounded-full border-[1.5px] border-border-strong bg-bg-surface transition-[border] checked:border-[5.5px] checked:border-accent focus-visible:outline-none"
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 text-14 leading-[1.4] md:leading-[1.45]",
                    selected ? "font-semibold text-accent" : "text-text-primary",
                  )}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </fieldset>

        {error && (
          <p id="outcome-error" role="alert" className="flex items-center gap-1.5 text-13 text-danger-fg">
            <Icon icon={CircleAlert} size={16} />
            {error}
          </p>
        )}

        <p className="flex items-center gap-2 text-12 leading-[1.45] text-text-tertiary">
          <Icon icon={Lock} size={14} />
          No name, address, or case number is attached to this response.
        </p>

        {submitButton("hidden md:flex w-full")}
      </div>

      <MobileActionBar>{submitButton("w-full")}</MobileActionBar>
    </form>
  );
}

function OutcomeThanks() {
  return (
    <div className="flex flex-1 flex-col items-center px-5 pt-10 pb-5 md:px-6 md:pt-14 md:pb-12">
      <section
        role="status"
        className="flex w-full flex-col items-center gap-4 text-center md:max-w-[560px] md:rounded-xl md:border md:border-border-default md:bg-bg-surface md:p-8"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-success-bg text-success-fg">
          <Icon icon={Check} size={24} />
        </span>
        <h1 className="text-22 leading-[1.25] font-semibold text-text-primary">Thank you</h1>
        <p className="text-15 leading-[1.45] text-text-secondary md:text-14">
          Your answer helps legal aid groups see how often the license defense is raised in Baltimore rent court.
        </p>
        <Link href="/legal-help" className={buttonClassName("secondary", "responsive", "w-full md:w-auto")}>
          Free legal help
        </Link>
      </section>
    </div>
  );
}

/** Loading stand-in for `OutcomeForm`: the real heading and note, placeholder options, a disabled submit. */
export function OutcomeFormSkeleton() {
  const submitButton = (className: string) => (
    <Button disabled size="responsive" className={className}>
      Submit anonymously
    </Button>
  );

  return (
    <div className="flex flex-1 flex-col md:items-center md:px-6 md:pt-14 md:pb-12">
      <div className="flex flex-1 flex-col gap-3.5 p-5 md:w-full md:max-w-[560px] md:flex-none md:gap-5 md:rounded-xl md:border md:border-border-default md:bg-bg-surface md:p-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-22 leading-[1.25] font-semibold text-text-primary md:text-24 md:leading-[1.25]">
            How did your hearing go?
          </h1>
          <p className="text-15 leading-[1.45] text-text-secondary">
            Anonymous. Used only to measure how often the license defense is raised.
          </p>
        </div>

        <div
          aria-hidden
          className="overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]"
        >
          {["w-44", "w-28", "w-32", "w-40", "w-24"].map((width) => (
            <div key={width} className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 last:border-b-0">
              <Skeleton className="size-[18px] shrink-0 rounded-full" />
              {/* 14px label: 19.6px line on mobile, 20.3px from md. */}
              <div className="flex h-[19.6px] min-w-0 flex-1 items-center md:h-[20.3px]">
                <Skeleton className={cn("h-3.5", width)} />
              </div>
            </div>
          ))}
        </div>

        <p className="flex items-center gap-2 text-12 leading-[1.45] text-text-tertiary">
          <Icon icon={Lock} size={14} />
          No name, address, or case number is attached to this response.
        </p>

        {submitButton("hidden md:flex w-full")}
      </div>

      <MobileActionBar>{submitButton("w-full")}</MobileActionBar>
    </div>
  );
}
