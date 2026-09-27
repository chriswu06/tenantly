import type { ReactNode } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/tenant/Stepper";

type FlowLayoutProps = {
  /** Mobile app bar title. */
  title: string;
  backHref: string;
  /** Zero-based stepper index. */
  step: number;
  /**
   * column: 640px centered column (extracting, verifying, edge states).
   * wide: full 1152px container (review, results).
   */
  width?: "column" | "wide";
  /** Mobile-only bottom action bar. */
  mobileFooter?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Page frame for the tenant flow screens: mobile app bar, stepper, body, and
 * an optional mobile action bar pinned to the bottom of the viewport.
 */
export function FlowLayout({
  title,
  backHref,
  step,
  width = "column",
  mobileFooter,
  className,
  children,
}: FlowLayoutProps) {
  return (
    <main className="flex flex-1 flex-col">
      <AppBar title={title} backHref={backHref} className="h-14 shrink-0 md:hidden" />
      <Stepper current={step} />
      <div className="flex flex-1 flex-col md:px-6">
        <div
          className={cn(
            "mx-auto flex w-full flex-1 flex-col",
            width === "column" ? "md:max-w-[640px] md:pt-12 md:pb-8" : "md:max-w-page md:py-8",
            className,
          )}
        >
          {children}
        </div>
      </div>
      {mobileFooter && <MobileActionBar>{mobileFooter}</MobileActionBar>}
    </main>
  );
}

/** White bar at the bottom of mobile screens holding the primary actions. */
export function MobileActionBar({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 flex flex-col gap-2.5 border-t border-border-default bg-bg-surface px-5 pt-4 pb-7 md:hidden print:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeading({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-22 font-semibold md:text-28 md:leading-[1.2] md:tracking-[-0.42px]">{title}</h1>
      {children && <p className="text-15 text-text-secondary">{children}</p>}
    </div>
  );
}
