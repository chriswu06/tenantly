"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/** Copies `text` to the clipboard and says so for two seconds. */
export function CopyButton({
  text,
  label = "Copy link",
  variant = "button",
  size = "sm",
  className,
  "aria-label": ariaLabel,
}: {
  text: string;
  label?: string;
  variant?: "button" | "link";
  size?: "xs" | "sm";
  className?: string;
  "aria-label"?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked (e.g. insecure origin): select-and-copy fallback.
      const area = document.createElement("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  const status = (
    <span role="status" aria-live="polite" className="sr-only">
      {copied ? "Copied to clipboard" : ""}
    </span>
  );

  if (variant === "link") {
    return (
      <>
        <button
          type="button"
          onClick={copy}
          aria-label={ariaLabel}
          className={cn(
            "inline-flex items-center gap-1 text-12 leading-[1.4] font-semibold whitespace-nowrap text-accent hover:underline",
            className,
          )}
        >
          <Icon icon={copied ? Check : Copy} size={14} />
          {copied ? "Copied" : label}
        </button>
        {status}
      </>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        size={size}
        leadingIcon={copied ? Check : Copy}
        onClick={copy}
        aria-label={ariaLabel}
        className={className}
      >
        {copied ? "Copied" : label}
      </Button>
      {status}
    </>
  );
}
