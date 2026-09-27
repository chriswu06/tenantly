import Link from "next/link";
import { cn } from "@/lib/utils";

export type TabItem = {
  href: string;
  label: string;
  /** Shorter label shown below `lg`, e.g. "Needs cert." for "Needs certification". */
  shortLabel?: string;
  count?: number;
  active?: boolean;
};

type TabsProps = {
  items: TabItem[];
  /** Accessible name for the tab list, e.g. "Case filters". */
  label: string;
  /**
   * - `filter`: list filters. Pills on mobile, segmented on desktop.
   * - `underline`: section tabs with an accent underline (e.g. Overview, Records, Activity).
   */
  variant?: "filter" | "underline";
  className?: string;
};

/** Link-based tabs. Each tab is a route or query string, so the active tab survives a reload. */
export function Tabs({ items, label, variant = "filter", className }: TabsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul
        className={cn(
          "flex items-center whitespace-nowrap",
          variant === "filter" ? "gap-1.5 overflow-x-auto lg:gap-1" : "gap-5 pt-2.5",
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={variant === "filter" ? filterClass(item.active) : underlineClass(item.active)}
            >
              {item.shortLabel ? (
                <>
                  <span className="lg:hidden">{item.shortLabel}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </>
              ) : (
                item.label
              )}
              {item.count !== undefined && variant === "filter" && (
                <span
                  className={cn(
                    "font-normal lg:text-12 lg:font-medium lg:text-text-tertiary",
                    item.active ? "text-border-strong" : "text-text-tertiary",
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function filterClass(active?: boolean) {
  return cn(
    "flex items-center gap-1 px-2.5 py-1.5 text-12 leading-none font-medium",
    // Mobile: rounded pills, the active one filled dark.
    "rounded-2xl border",
    active
      ? "border-text-primary bg-text-primary text-text-inverse"
      : "border-border-default bg-bg-surface text-text-secondary",
    // Desktop: flat segments, the active one on a subtle fill.
    "lg:gap-1.5 lg:rounded-md lg:border-0 lg:text-13",
    active ? "lg:bg-bg-subtle lg:font-semibold lg:text-text-primary" : "lg:bg-transparent lg:hover:text-text-primary",
  );
}

function underlineClass(active?: boolean) {
  return cn(
    "flex border-b-2 pt-1.5 pb-2.5 text-14 leading-none",
    active ? "border-accent font-semibold text-accent" : "border-transparent font-medium text-text-secondary hover:text-text-primary",
  );
}
