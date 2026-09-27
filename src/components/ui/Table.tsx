import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/*
 * Data table pieces.
 *
 * <TableCard>
 *   <TableToolbar>…tabs and buttons…</TableToolbar>
 *   <Table>
 *     <TableHead><tr><Th className="w-[130px]">Reference</Th>…</tr></TableHead>
 *     <tbody><Tr><Td>…</Td></Tr></tbody>
 *   </Table>
 *   <TablePagination from={1} to={8} total={24} nextHref="?page=2" />
 * </TableCard>
 *
 * Set column widths on the <Th>s; leave one column without a width so it takes the rest.
 */

/** White card around a table and its toolbar and pagination. */
export function TableCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("overflow-hidden rounded-lg border border-border-default bg-bg-surface", className)}
      {...props}
    />
  );
}

/** Row above the table for filters and actions. */
export function TableToolbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex h-13 items-center gap-2 border-b border-border-default pr-4 pl-2", className)}
      {...props}
    />
  );
}

/** The table itself. Scrolls sideways inside the card instead of widening the page. */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full table-fixed border-collapse text-left", className)} {...props} />
    </div>
  );
}

export function TableHead({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn("bg-bg-app", className)} {...props} />;
}

/** Header cell. First and last cells get the table's 16px side padding. */
export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "h-9 border-b border-border-default pr-2 text-12 leading-[1.4] font-medium whitespace-nowrap text-text-tertiary first:pl-4 last:pr-4",
        className,
      )}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cn("border-b border-border-default hover:bg-bg-app", className)} {...props} />;
}

/** Body cell in secondary text. Override the color for the primary column. */
export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "h-12 truncate pr-2 text-13 leading-[1.4] text-text-secondary first:pl-4 last:pr-4",
        className,
      )}
      {...props}
    />
  );
}

type TablePaginationProps = {
  from: number;
  to: number;
  total: number;
  /** Omit to disable the button. */
  prevHref?: string;
  nextHref?: string;
};

/** "Showing 1–8 of 24" with previous and next buttons. */
export function TablePagination({ from, to, total, prevHref, nextHref }: TablePaginationProps) {
  return (
    <div className="flex h-12 items-center justify-between px-4">
      <p className="text-13 leading-[1.4] text-text-secondary">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex gap-2">
        <PagerButton href={prevHref} label="Previous page">
          <Icon icon={ChevronLeft} size={16} />
        </PagerButton>
        <PagerButton href={nextHref} label="Next page">
          <Icon icon={ChevronRight} size={16} />
        </PagerButton>
      </div>
    </div>
  );
}

function PagerButton({ href, label, children }: { href?: string; label: string; children: ReactNode }) {
  const className =
    "flex size-8 items-center justify-center rounded-md border border-border-strong text-text-secondary";
  if (!href) {
    return (
      <span aria-disabled="true" aria-label={label} role="link" className={cn(className, "opacity-40")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(className, "hover:bg-bg-subtle")}>
      {children}
    </Link>
  );
}
