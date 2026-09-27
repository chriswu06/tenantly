import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Placeholders shown while a page's data loads. Size them to match what they
 * stand in for, so nothing moves when the real content arrives.
 *
 * <LoadingRegion label="Loading cases">
 *   <Skeleton className="h-6 w-40" />
 *   <SkeletonText lines={2} />
 * </LoadingRegion>
 */

/** A grey block. Give it the width and height of the thing it replaces. */
export function Skeleton({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      aria-hidden
      className={cn("rounded-md bg-bg-subtle motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}

/** Lines of placeholder text; the last line is shorter, like a paragraph. */
export function SkeletonText({
  lines = 1,
  lineClassName = "h-3.5",
  className,
}: {
  lines?: number;
  /** Height of each line, e.g. "h-3" for 12px text. */
  lineClassName?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn(lineClassName, i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}

/**
 * Wraps a loading layout: announces `label` to screen readers once, and hides
 * the placeholder shapes from them.
 */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
