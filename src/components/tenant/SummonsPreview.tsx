import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { DocThumb } from "@/components/tenant/scan/DocThumb";
import { cn } from "@/lib/utils";

type SummonsPreviewProps = {
  className?: string;
};

/**
 * Sits where the summons image would, next to the review form. The file is
 * deleted as soon as it has been read, so this card says so and points the
 * tenant to their paper copy instead of showing the image.
 */
export function SummonsPreview({ className }: SummonsPreviewProps) {
  return (
    <section
      aria-labelledby="summons-preview-title"
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface py-2.5 pr-3.5 pl-2.5 md:flex-col md:items-stretch md:gap-0 md:rounded-[10px] md:p-0",
        className,
      )}
    >
      <div className="hidden items-center justify-between gap-3 border-b border-border-default px-4 py-3 text-13 leading-[1.45] md:flex">
        <p className="truncate font-medium">Your summons</p>
        <Link href="/" className="shrink-0 rounded-md font-semibold text-accent hover:underline">
          Replace file
        </Link>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-col md:items-center md:gap-3 md:bg-bg-subtle md:px-6 md:py-10 md:text-center">
        <DocThumb className="md:h-[72px] md:w-14" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-none md:gap-1">
          <h2 id="summons-preview-title" className="truncate text-14 font-medium md:whitespace-normal">
            <span className="md:hidden">Your summons</span>
            <span className="hidden md:inline">Compare with your paper summons</span>
          </h2>
          <p className="flex items-center gap-1.5 text-12 leading-[1.45] text-text-tertiary md:justify-center md:text-13">
            <Icon icon={ShieldCheck} size={14} className="shrink-0 text-success-fg" />
            The photo was deleted after reading.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Loading state for `SummonsPreview`, at the same size on both breakpoints. Pass the same `className`. */
export function SummonsPreviewSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface py-2.5 pr-3.5 pl-2.5 md:hidden">
        <Skeleton className="h-14 w-11 shrink-0 rounded-sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex h-[21px] items-center">
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="flex h-[17.4px] items-center">
            <Skeleton className="h-3 w-52 max-w-full" />
          </div>
        </div>
      </div>

      <div className="hidden flex-col overflow-hidden rounded-[10px] border border-border-default bg-bg-surface md:flex">
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-3">
          <div className="flex h-[18.85px] items-center">
            <Skeleton className="h-3.5 w-28" />
          </div>
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-[180px] rounded-none" />
      </div>
    </div>
  );
}
