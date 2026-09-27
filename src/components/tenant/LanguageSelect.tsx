"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export const LANGUAGES = [
  { code: "en", short: "EN", name: "English" },
  { code: "es", short: "ES", name: "Español" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

type LanguageSelectProps = {
  value?: LanguageCode;
  defaultValue?: LanguageCode;
  onChange?: (code: LanguageCode) => void;
  /** compact: "EN" in the mobile app bar. full: "English" in the web header. */
  variant?: "compact" | "full";
  className?: string;
};

/**
 * A native <select> laid invisibly over the pill, so the pill can show a short
 * code while the open list shows full language names.
 */
export function LanguageSelect({
  value,
  defaultValue = "en",
  onChange,
  variant = "compact",
  className,
}: LanguageSelectProps) {
  const [uncontrolled, setUncontrolled] = useState<LanguageCode>(defaultValue);
  const current = value ?? uncontrolled;
  const selected = LANGUAGES.find((language) => language.code === current) ?? LANGUAGES[0];

  return (
    <label
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border-default text-13 leading-none font-medium text-text-secondary hover:bg-bg-subtle",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
        variant === "compact" ? "py-1.5 pr-2.5 pl-2" : "py-2 pr-3 pl-2.5",
        className,
      )}
    >
      <Icon icon={Globe} size={16} />
      <span aria-hidden>{variant === "compact" ? selected.short : selected.name}</span>
      <span className="sr-only">Language</span>
      <select
        value={current}
        onChange={(event) => {
          const code = event.target.value as LanguageCode;
          setUncontrolled(code);
          onChange?.(code);
        }}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code} lang={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </label>
  );
}
