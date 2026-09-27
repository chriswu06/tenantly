"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/** Small bordered "Copy" button that copies `text` to the clipboard. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border-default px-2 py-1 text-12 leading-none font-medium text-text-secondary hover:bg-bg-subtle"
    >
      <Icon icon={copied ? Check : Copy} size={14} />
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
