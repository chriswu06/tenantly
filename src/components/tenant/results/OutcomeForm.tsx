"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { OutcomeOption } from "@/types/case";
import { MobileActionBar } from "./MobileActionBar";
import { buttonClassName } from "@/components/ui/Button";

const options: { value: OutcomeOption; label: string }[] = [
  { value: "raised_license_defense", label: "Raised the license defense" },
  { value: "case_dismissed", label: "Case dismissed" },
  { value: "case_postponed", label: "Case postponed" },
  { value: "did_not_raise_defense", label: "Did not raise the defense" },
  { value: "did_not_attend", label: "Did not attend" },
];

/**
 * Anonymous hearing outcome report (Figma 10 and 22). Mobile: full screen with
 * a bottom action bar. Desktop: centered 560px card.
 */
export function OutcomeForm() {
  const router = useRouter();
  const [outcome, setOutcome] = useState<OutcomeOption>("raised_license_defense");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: POST the anonymous outcome. Static build: return to the start screen.
    router.push("/");
  }

  const submitButton = (className: string) => (
    <button type="submit" className={buttonClassName("primary", "responsive", className)}>
      Submit anonymously
    </button>
  );

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col md:items-center md:px-6 md:pt-14 md:pb-12">
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
          aria-describedby="outcome-hint"
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
