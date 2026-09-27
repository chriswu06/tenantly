"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

type Highlight = { top: number; width: number; tag: string; tone: "warn" | "accent" };

// Measured from the Figma page preview (frame 16), relative to the white sheet.
const sheetLines: [top: number, width: number][] = [
  [40, 200], [70, 300], [100, 260], [150, 320], [180, 300], [210, 240], [260, 320],
  [290, 280], [320, 300], [370, 220], [400, 320], [430, 260], [480, 300], [510, 180],
];

const highlights: Highlight[] = [
  { top: 94, width: 274, tag: "Address", tone: "warn" },
  { top: 144, width: 334, tag: "Case #", tone: "accent" },
  { top: 204, width: 254, tag: "Plaintiff", tone: "accent" },
  { top: 394, width: 334, tag: "Court date", tone: "accent" },
];

const thumbLines = ["w-[26px]", "w-[18px]", "w-[26px]", "w-[18px]", "w-[26px]", "w-[18px]"];

type SummonsPreviewProps = {
  fileName: string;
  className?: string;
};

/**
 * The uploaded summons with the areas each value was read from.
 * Mobile (frame 04): a compact row whose "View" button expands the page.
 * Web (frame 16): the full page next to the form.
 */
export function SummonsPreview({ fileName, className }: SummonsPreviewProps) {
  const [open, setOpen] = useState(false);
  const pageId = useId();

  return (
    <div className={className}>
      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface py-2.5 pr-3.5 pl-2.5">
          <span
            aria-hidden
            className="relative flex h-[52px] w-10 shrink-0 flex-col gap-1 overflow-hidden rounded-sm border border-border-default bg-bg-subtle pt-1.5 pl-[5px]"
          >
            {thumbLines.map((width, index) => (
              <span key={index} className={cn("h-[3px] shrink-0 bg-border-strong", width)} />
            ))}
            <span className="absolute top-[11px] left-[3px] h-[7px] w-[30px] rounded-[1px] border border-warning-fg bg-warning-bg" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-14 font-medium">{fileName}</span>
            <span className="truncate text-12 text-text-tertiary">Tap to compare with highlighted fields</span>
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={pageId}
            onClick={() => setOpen((value) => !value)}
            className="rounded-md text-13 font-semibold text-accent"
          >
            {open ? "Hide" : "View"}
          </button>
        </div>
        {open && (
          <div id={pageId} className="overflow-x-auto rounded-lg border border-border-default">
            <PageSheet />
          </div>
        )}
      </div>

      <section
        aria-label="Your summons"
        className="hidden flex-col overflow-hidden rounded-[10px] border border-border-default bg-bg-surface md:flex"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-3 text-13 leading-[1.45]">
          <p className="truncate font-medium">{fileName}</p>
          <Link href="/" className="shrink-0 rounded-md font-semibold text-accent hover:underline">
            Replace file
          </Link>
        </div>
        <PageSheet />
      </section>
    </div>
  );
}

function PageSheet() {
  return (
    <div className="flex h-[600px] min-w-[420px] justify-center bg-bg-subtle pt-5">
      <div
        role="img"
        aria-label="Summons page with the address, case number, plaintiff and court date highlighted"
        className="relative h-[560px] w-[380px] shrink-0 border border-border-default bg-bg-surface"
      >
        {highlights.map(({ top, width, tag, tone }) => (
          <span
            key={tag}
            className={cn(
              "absolute left-[33px] h-[18px] rounded-[3px] border-[1.5px] opacity-90",
              tone === "warn" ? "border-warning-fg bg-warning-bg" : "border-accent bg-accent-subtle",
            )}
            style={{ top: top - 1, width }}
          >
            <span
              className={cn(
                "absolute right-0 -top-4 rounded-sm px-1.5 py-0.5 text-[10px] leading-[1.2] font-semibold whitespace-nowrap text-text-inverse",
                tone === "warn" ? "bg-warning-fg" : "bg-accent",
              )}
            >
              {tag}
            </span>
          </span>
        ))}
        {sheetLines.map(([top, width]) => (
          <span
            key={top}
            className="absolute left-[39px] h-1.5 bg-border-default"
            style={{ top: top - 1, width }}
          />
        ))}
      </div>
    </div>
  );
}

/** Loading stand-in for `SummonsPreview`, at the same size on both breakpoints. Pass the same `className`. */
export function SummonsPreviewSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface py-2.5 pr-3.5 pl-2.5 md:hidden">
        <Skeleton className="h-[52px] w-10 shrink-0 rounded-sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex h-[21px] items-center">
            <Skeleton className="h-3.5 w-36" />
          </div>
          <div className="flex h-[16.8px] items-center">
            <Skeleton className="h-3 w-52 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-4 w-8" />
      </div>

      <div className="hidden flex-col overflow-hidden rounded-[10px] border border-border-default bg-bg-surface md:flex">
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-3">
          <div className="flex h-[18.85px] items-center">
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-[600px] rounded-none" />
      </div>
    </div>
  );
}
