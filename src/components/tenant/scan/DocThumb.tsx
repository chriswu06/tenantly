import { cn } from "@/lib/utils";

const lineWidths = ["w-7", "w-5", "w-7", "w-5", "w-7"];

/** Tiny page thumbnail with text lines (44×56), used next to file names. */
export function DocThumb({ faded = false, className }: { faded?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-14 w-11 shrink-0 flex-col gap-[5px] overflow-hidden rounded-sm border border-border-default bg-bg-subtle pt-2 pl-1.5",
        className,
      )}
    >
      {lineWidths.map((width, index) => (
        <span key={index} className={cn("h-[3px] shrink-0 bg-border-strong", width, faded && "opacity-50")} />
      ))}
    </span>
  );
}
