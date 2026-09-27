"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Moves on from a progress screen (extracting, verifying) after a pause, so
 * the static flow can be clicked through. Replaces the history entry so Back
 * doesn't bounce the tenant forward again.
 */
export function AutoAdvance({ href, delay = 6000 }: { href: string; delay?: number }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
    const timer = window.setTimeout(() => router.replace(href), delay);
    return () => window.clearTimeout(timer);
  }, [router, href, delay]);

  return null;
}
