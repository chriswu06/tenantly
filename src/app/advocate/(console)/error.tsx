"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";

/** Errors inside the console: the sidebar stays, the page area shows a retry. */
export default function ConsoleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-lg rounded-lg border border-border-default bg-bg-surface">
        <EmptyState
          icon={TriangleAlert}
          title="This page didn’t load"
          description={
            error.digest ? `Something went wrong on our side (reference ${error.digest}).` : "Something went wrong on our side."
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={retry} className={buttonClassName("primary", "sm")}>
                <Icon icon={RotateCcw} size={16} />
                Try again
              </button>
              <Link href="/advocate" className={buttonClassName("secondary", "sm")}>
                Go to overview
              </Link>
            </div>
          }
        />
      </div>
    </main>
  );
}
