import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bottom action bar on mobile screens. Hidden from `md` up. */
export function MobileActionBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-t border-border-default bg-bg-surface px-5 pt-4 pb-7 md:hidden print:hidden",
        // Below the 390px design width, two side-by-side buttons drop their icons and tighten up to fit.
        "max-[389px]:[&>.flex-1]:px-3 max-[389px]:[&>.flex-1]:text-14 max-[389px]:[&>.flex-1_svg]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
