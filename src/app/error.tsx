"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { StatusPage } from "@/components/layout/StatusPage";
import { buttonClassName } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={TriangleAlert}
      title="Something went wrong"
      description="We couldn't load this page. Try again, or go back to the start."
    >
      <button type="button" onClick={reset} className={buttonClassName("primary", "responsive")}>
        <Icon icon={RotateCcw} size={18} />
        Try again
      </button>
      <Link href="/" className={buttonClassName("secondary", "responsive")}>
        Back to start
      </Link>
    </StatusPage>
  );
}
