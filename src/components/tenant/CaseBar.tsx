import Link from "next/link";
import { ChevronLeft, Folder } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type CaseBarProps = {
  /** Case reference, e.g. "STD-2026-0412". */
  reference: string;
  /** Short property address, e.g. "2417 E Monument St, Apt 2". */
  address: string;
  /** Desktop breadcrumb back link. The mobile app bar has its own back button. */
  backHref?: string;
  backLabel?: string;
  className?: string;
};

/**
 * Case context strip under the app bar (Figma 07–10, 29, 30) and the
 * desktop breadcrumb bar (Figma 19–21, 27, 28).
 *
 * @example <CaseBar reference="STD-2026-0412" address="2417 E Monument St, Apt 2" backHref="/results" />
 */
export function CaseBar({ reference, address, backHref = "/results", backLabel = "Results", className }: CaseBarProps) {
  return (
    <div
      className={cn(
        "border-b border-border-default bg-bg-subtle px-4 py-2 md:bg-bg-surface md:px-6 md:py-2.5",
        className,
      )}
    >
      <div className="mx-auto flex max-w-page items-center gap-2 md:gap-2.5">
        <Link
          href={backHref}
          className="hidden shrink-0 items-center gap-1 rounded-md text-13 leading-none font-semibold text-accent hover:underline md:flex"
        >
          <Icon icon={ChevronLeft} size={16} />
          {backLabel}
        </Link>
        <span aria-hidden className="hidden text-13 leading-none text-text-tertiary md:inline">
          /
        </span>
        <Icon icon={Folder} size={14} className="text-text-tertiary" />
        <span className="sr-only">Case</span>
        <span className="shrink-0 font-mono text-12 leading-none whitespace-nowrap text-text-secondary">
          {reference}
        </span>
        <span className="min-w-0 flex-1 truncate text-12 leading-none text-text-tertiary md:text-13">
          · {address}
        </span>
      </div>
    </div>
  );
}
