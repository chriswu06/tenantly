import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { TrustNote } from "@/components/tenant/TrustNote";
import { DocThumb } from "@/components/tenant/scan/DocThumb";
import { FieldStatusList } from "@/components/tenant/scan/FieldStatusList";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";
import { RunOnce } from "@/components/tenant/scan/RunOnce";
import { readSummons } from "@/lib/cases/actions";
import { requireTenantCase } from "@/lib/cases/session";

export const metadata: Metadata = { title: "Reading your summons", robots: { index: false, follow: false } };

const fields = [
  "Property address",
  "Case number",
  "Landlord (plaintiff)",
  "Court date and time",
  "Filing date",
  "License number on complaint",
].map((label) => ({ label, status: "reading" as const }));

export default async function ExtractingPage() {
  await requireTenantCase();

  return (
    <FlowLayout title="Scan summons" backHref="/" step={0} className="gap-4 p-5 md:gap-5 md:px-0">
      <RunOnce
        action={readSummons}
        fallback={
          <Alert tone="danger" title="Reading stopped">
            We lost the connection while reading your summons.{" "}
            <Link href="/scan/review" className="font-semibold text-accent underline">
              Enter the details yourself
            </Link>{" "}
            instead.
          </Alert>
        }
      />
      <PageHeading title="Extracting details">
        Reading your summons. This usually takes under 10 seconds.
      </PageHeading>

      <section
        aria-label="Uploaded summons"
        className="flex flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-3 md:gap-3.5 md:rounded-[10px] md:p-4"
      >
        <div className="flex items-center gap-3 md:gap-3.5">
          <DocThumb />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4] md:leading-[1.45]">
            <p className="truncate text-14 font-medium">Your summons</p>
            <p className="text-12 text-text-tertiary">Uploaded securely</p>
          </div>
          <Link
            href="/"
            className="hidden rounded-md text-13 leading-[1.45] font-semibold text-accent hover:underline md:block"
          >
            Cancel
          </Link>
        </div>
        <div className="flex flex-col gap-1.5 md:gap-3.5">
          <div
            role="progressbar"
            aria-label="Extracting fields"
            aria-busy="true"
            className="h-1.5 overflow-hidden rounded-[3px] bg-bg-subtle"
          >
            <div className="h-full w-2/5 rounded-[3px] bg-accent motion-safe:animate-pulse" />
          </div>
          <div className="flex justify-between text-12 leading-[1.4] text-text-secondary md:leading-[1.45]">
            <span>Extracting fields</span>
            <span className="font-medium">Working…</span>
          </div>
        </div>
      </section>

      <FieldStatusList fields={fields} />

      <div className="flex-1 md:hidden" />
      <TrustNote align="start">The image is processed in memory and deleted after extraction.</TrustNote>
    </FlowLayout>
  );
}
