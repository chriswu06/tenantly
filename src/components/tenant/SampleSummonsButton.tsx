"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { useSummonsUpload } from "@/hooks/useSummonsUpload";
import { cn } from "@/lib/utils";

const SAMPLE_SRC = "/sample-summons.jpg";

/**
 * Runs the check on a made-up summons (`public/sample-summons.jpg`), so people
 * can try Tenantly or demo it without a real court document.
 */
export function SampleSummonsButton({ className }: { className?: string }) {
  const { upload, pending } = useSummonsUpload();
  const [loading, setLoading] = useState(false);
  const busy = pending || loading;

  async function useSample() {
    if (busy) return;
    setLoading(true);
    try {
      const blob = await (await fetch(SAMPLE_SRC)).blob();
      upload(blob, "sample-summons.jpg");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={useSample}
      aria-busy={busy || undefined}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed border-accent-border bg-accent-subtle/60 p-2.5 pr-4 text-left transition-colors hover:bg-accent-subtle",
        busy && "cursor-wait",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static thumbnail */}
      <img src={SAMPLE_SRC} alt="" width={44} height={52} className="h-13 w-11 shrink-0 rounded-sm border border-border-default object-cover object-top" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-14 leading-[1.3] font-semibold text-accent">
          {busy ? "Loading the sample…" : "No summons handy? Try a sample"}
        </span>
        <span className="text-12 leading-[1.35] text-text-secondary">A made-up summons, not a real case</span>
      </span>
      {busy ? <Spinner size={16} /> : <Icon icon={FileText} size={16} className="text-accent" />}
    </button>
  );
}
