import type { ComponentProps, ReactNode } from "react";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/* Layout pieces shared by the console pages. Render <ConsoleHeader> first, then <PageBody>. */

export function PageBody({ className, ...props }: ComponentProps<"main">) {
  return <main className={cn("flex min-w-0 flex-col gap-3.5 p-4 lg:gap-5 lg:p-6", className)} {...props} />;
}

/**
 * <PageBody> for a loading.tsx: announces `label` once and keeps the page's gaps,
 * so the placeholders sit exactly where the real content will.
 */
export function LoadingPageBody({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <PageBody className={className}>
      <LoadingRegion label={label} className="flex min-w-0 flex-col gap-[inherit]">
        {children}
      </LoadingRegion>
    </PageBody>
  );
}

/**
 * Placeholder for one line of text. Give it the same text size and leading classes as the
 * text it replaces (e.g. "text-14 leading-[1.4]") and a width; it takes exactly one line's height.
 * `barClassName` narrows the grey bar inside a wider slot (e.g. "w-3/5" in a flex-1 column).
 */
export function LineSkeleton({ className, barClassName }: { className?: string; barClassName?: string }) {
  return (
    <div aria-hidden className={cn("flex h-[1lh] min-w-0 items-center", className)}>
      <Skeleton className={cn("h-[0.8em] w-full rounded", barClassName)} />
    </div>
  );
}

/** Placeholder the size of a <Badge> (22px tall). */
export function BadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-[22.4px] w-24 shrink-0 rounded-md", className)} />;
}

type PageHeaderProps = {
  title: string;
  description: ReactNode;
  /** Buttons on the right, bottom-aligned with the description. */
  actions?: ReactNode;
};

/**
 * Desktop page title and description. Mobile shows the title in the app bar instead,
 * so this is hidden below `lg` and its <h1> is the only visible one on desktop.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="hidden items-end gap-3 lg:flex">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-24 font-semibold text-text-primary">{title}</h1>
        <p className="text-14 leading-[1.4] text-text-secondary">{description}</p>
      </div>
      {actions}
    </div>
  );
}

/** White card with a header row. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("overflow-hidden rounded-[10px] border border-border-default bg-bg-surface", className)}
      {...props}
    />
  );
}

type PanelHeaderProps = {
  title: ReactNode;
  /** Heading level for the title. Panels sit under the page <h1>. */
  as?: "h2" | "h3";
  /** Small text or badge at the right, e.g. "Last 30 days". */
  aside?: ReactNode;
  className?: string;
};

export function PanelHeader({ title, as: Heading = "h2", aside, className }: PanelHeaderProps) {
  return (
    <div className={cn("flex h-12 items-center gap-2 border-b border-border-default px-4", className)}>
      <Heading className="min-w-0 flex-1 text-14 leading-[1.4] font-semibold text-text-primary">{title}</Heading>
      {aside}
    </div>
  );
}

export function PanelMeta({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("shrink-0 text-12 leading-[1.4] whitespace-nowrap text-text-tertiary", className)} {...props} />;
}

export function Avatar({ initials, label, className }: { initials: string; label?: string; className?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-12 leading-none font-semibold text-text-secondary",
        className,
      )}
    >
      {initials}
    </span>
  );
}

