import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The Tenantly mark: a house with a check in it. Same artwork as
 * `public/logo.svg` and the favicon (`src/app/icon.svg`).
 *
 * @example <LogoMark className="size-7" />
 */
export function LogoMark({ className }: { className?: string }) {
  // Unique per instance: a gradient defined inside a hidden copy (e.g. the
  // desktop header on mobile) can't be referenced by the visible one.
  const gradientId = useId();
  return (
    <svg aria-hidden viewBox="0 0 32 32" fill="none" className={cn("size-7 shrink-0", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path
        d="M8.5 15 16 8.5 23.5 15v8.25a1.75 1.75 0 0 1-1.75 1.75h-11.5a1.75 1.75 0 0 1-1.75-1.75Z"
        stroke="#fff"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        d="m12.5 18.75 2.5 2.5 4.75-4.75"
        stroke="#5eead4"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
