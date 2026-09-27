import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Layout pieces shared by the console pages (Figma frames 11, 50–65).
 * Render <ConsoleHeader> first, then <PageBody>.
 */

/** Page content: 16px padding and 14px gaps on mobile, 24px padding and 20px gaps on desktop. */
export function PageBody({ className, ...props }: ComponentProps<"main">) {
  return <main className={cn("flex min-w-0 flex-col gap-3.5 p-4 lg:gap-5 lg:p-6", className)} {...props} />;
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

/** White card with a header row (frames 50, 60, 62, 64 panels). */
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

/** 48px panel header: 14px semibold title, optional aside. */
export function PanelHeader({ title, as: Heading = "h2", aside, className }: PanelHeaderProps) {
  return (
    <div className={cn("flex h-12 items-center gap-2 border-b border-border-default px-4", className)}>
      <Heading className="min-w-0 flex-1 text-14 leading-[1.4] font-semibold text-text-primary">{title}</Heading>
      {aside}
    </div>
  );
}

/** Light 12px aside text for panel headers. */
export function PanelMeta({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("shrink-0 text-12 leading-[1.4] whitespace-nowrap text-text-tertiary", className)} {...props} />;
}

/** 32px initials avatar. */
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

