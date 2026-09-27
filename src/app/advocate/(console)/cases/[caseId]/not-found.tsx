import Link from "next/link";
import { FolderX } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

/** Unknown case reference, or a case not shared with this organization. */
export default function CaseNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-lg rounded-lg border border-border-default bg-bg-surface">
        <EmptyState
          icon={FolderX}
          title="Case not found"
          description="This case doesn’t exist, or it hasn’t been shared with your organization."
          action={
            <Link href="/advocate/cases" className={buttonClassName("secondary", "sm")}>
              Back to cases
            </Link>
          }
        />
      </div>
    </main>
  );
}
