"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/** "Copy" text button that puts `value` on the clipboard and confirms for 2 seconds. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard blocked (e.g. insecure context): the address stays selectable.
        }
      }}
      className="flex shrink-0 items-center gap-1 rounded-sm text-12 leading-none font-semibold text-accent"
    >
      <Icon icon={copied ? Check : Copy} size={14} />
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
