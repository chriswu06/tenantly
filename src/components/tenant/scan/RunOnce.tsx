"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Calls a Server Action once the page has rendered, then moves on to the
 * `next` path it returns. Replaces the history entry so Back doesn't rerun it.
 * Renders `fallback` if the action fails (e.g. the connection dropped).
 */
export function RunOnce({
  action,
  fallback,
}: {
  action: () => Promise<{ next: string; status?: string }>;
  fallback: React.ReactNode;
}) {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    action()
      .then((result) => {
        const next =
          result.status === "unavailable" ? `${result.next}${result.next.includes("?") ? "&" : "?"}read=unavailable` : result.next;
        router.replace(next);
      })
      .catch((error: unknown) => {
        console.error(error);
        setFailed(true);
      });
  }, [action, router]);

  return failed ? fallback : null;
}
