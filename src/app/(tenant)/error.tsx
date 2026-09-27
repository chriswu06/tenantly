"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Errors in the tenant flow: keeps the site header and footer, offers a retry. */
export default function TenantError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger-fg">
          <Icon icon={TriangleAlert} size={22} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-22 font-semibold">Something went wrong</h1>
          <p className="text-15 text-text-secondary">
            Your information is safe. Try again, and if it keeps happening, start over from your summons.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 pt-2 md:w-auto md:flex-row">
          <button type="button" onClick={retry} className={buttonClassName("primary", "responsive")}>
            <Icon icon={RotateCcw} size={18} />
            Try again
          </button>
          <Link href="/" className={buttonClassName("secondary", "responsive")}>
            Start over
          </Link>
        </div>
      </div>
    </main>
  );
}
