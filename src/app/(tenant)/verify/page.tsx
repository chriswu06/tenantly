import type { Metadata } from "next";
import { Database, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { VerificationSteps } from "@/components/tenant/VerificationSteps";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";
import { RunOnce } from "@/components/tenant/scan/RunOnce";
import { runLicenseCheck } from "@/lib/cases/actions";
import { requireTenantCase } from "@/lib/cases/session";
import { normalizedAddressOf } from "@/lib/cases/tenant";

export const metadata: Metadata = { title: "Checking the rental license", robots: { index: false, follow: false } };

// The address is already normalized when this page opens; the lookup runs while it shows.
const verificationSteps = [
  { label: "Normalize address", detail: "Completed", state: "done" },
  { label: "Query DHCD license records", detail: "In progress", state: "active" },
  { label: "Match property records", detail: "Waiting", state: "waiting" },
  { label: "Compare license dates to filing date", detail: "Waiting", state: "waiting" },
] as const;

export default async function VerifyPage() {
  const row = await requireTenantCase();
  if (!row.in_baltimore_city || !row.normalized_address) redirect(row.normalized_address ? "/scan/outside-area" : "/scan/review");

  return (
    <FlowLayout title="Verify license" backHref="/scan/review" step={2} className="gap-4 p-5 md:gap-5 md:px-0">
      <RunOnce
        action={runLicenseCheck}
        fallback={
          <Alert tone="danger" title="The check stopped">
            We lost the connection while checking records.{" "}
            <Link href="/verify/guided-check" className="font-semibold text-accent underline">
              Check the city lookup yourself
            </Link>{" "}
            instead.
          </Alert>
        }
      />
      <PageHeading title="Verifying rental license">
        Checking Baltimore City DHCD records for this property. This usually takes under 30 seconds.
      </PageHeading>

      <section
        aria-labelledby="normalized-address"
        className="flex flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-3.5 md:gap-1.5 md:rounded-[10px] md:p-4"
      >
        <h2
          id="normalized-address"
          className="flex items-center gap-2 text-12 leading-[1.4] font-medium text-text-secondary md:leading-[1.45]"
        >
          <Icon icon={MapPin} size={16} className="text-text-tertiary" />
          Normalized address
        </h2>
        <p className="font-mono text-13 leading-[1.5] md:text-14 md:leading-[1.45]">{normalizedAddressOf(row)}</p>
      </section>

      <VerificationSteps steps={[...verificationSteps]} />

      <div className="flex-1 md:hidden" />
      <aside className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-subtle p-3 text-12 leading-[1.45] text-text-secondary md:flex-row md:items-center md:gap-2 md:border-0">
        <p className="flex items-center gap-2 leading-[1.4] font-medium md:hidden">
          <Icon icon={Database} size={14} />
          Source: Baltimore City DHCD
        </p>
        <Icon icon={Database} size={14} className="hidden md:block" />
        <p className="md:hidden">
          Results are informational; an official DHCD certification is required as evidence in court.
        </p>
        <p className="hidden md:block md:min-w-0 md:flex-1">
          Source: Baltimore City DHCD. Results are informational; an official DHCD certification is required as
          evidence in court.
        </p>
      </aside>
    </FlowLayout>
  );
}
