"use client";

import { useActionState, useId } from "react";
import { ArrowRight, CircleAlert } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { submitGuidedCheck } from "@/lib/cases/actions";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/validation/schemas";

type Option = { value: "none" | "expired" | "active"; title: string; detail: string };

/**
 * Step 3 of the guided check: what the city's lookup showed. Posts `finding`
 * to `submitGuidedCheck`, which records it and opens the results.
 */
export function GuidedCheckForm({
  options,
  defaultValue,
  legend,
}: {
  options: Option[];
  defaultValue?: Option["value"];
  legend: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitGuidedCheck, {});
  const error = state.fieldErrors?.finding?.[0];
  const errorId = useId();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <fieldset
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="flex flex-col gap-2.5"
      >
        {legend}
        <div className="flex flex-col gap-2 md:flex-row">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 rounded-lg border bg-bg-surface p-3 leading-[1.45] hover:bg-bg-app",
                error ? "border-danger-fg" : "border-border-strong",
                "has-checked:border-accent has-checked:bg-accent-subtle",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
              )}
            >
              <input
                type="radio"
                name="finding"
                value={option.value}
                defaultChecked={option.value === defaultValue}
                className="sr-only"
              />
              <span className="text-13 font-semibold">{option.title}</span>
              <span className="text-12 text-text-tertiary">{option.detail}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-12 text-danger-fg">
          <Icon icon={CircleAlert} size={14} />
          {error}
        </p>
      )}
      <SubmitButton
        pending={pending}
        trailingIcon={<Icon icon={ArrowRight} size={16} />}
        iconSize={16}
        className={buttonClassName("primary", "compact", "h-11 w-full text-14 md:h-9.5 md:w-auto md:self-start md:text-13")}
      >
        {pending ? "Saving…" : "See my results"}
      </SubmitButton>
    </form>
  );
}
