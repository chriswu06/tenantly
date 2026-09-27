import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthHeading({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 lg:gap-1.5", className)}>
      <h1 className="text-22 font-semibold lg:text-26">{title}</h1>
      <p className="text-14 leading-[1.45] text-text-secondary">{children}</p>
    </div>
  );
}

/** Accent text link, e.g. "Create your account". */
export const authLinkClass = "rounded-md font-semibold text-accent hover:underline";

/** Full-width secondary button look for links. */
export const authSecondaryLinkClass =
  "flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-surface px-4 text-15 leading-none font-semibold text-text-primary hover:bg-bg-subtle lg:h-11 lg:text-14";
