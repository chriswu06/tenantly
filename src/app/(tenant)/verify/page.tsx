import { Database, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { VerificationSteps } from "@/components/tenant/VerificationSteps";
import { AutoAdvance } from "@/components/tenant/scan/AutoAdvance";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";
import { normalizedAddress, verificationSteps } from "@/lib/mock/scan";

export default function VerifyPage() {
  return (
    <FlowLayout title="Verify license" backHref="/scan/review" step={2} className="gap-4 p-5 md:gap-5 md:px-0">
      <AutoAdvance href="/results" />
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
        <p className="font-mono text-13 leading-[1.5] md:text-14 md:leading-[1.45]">{normalizedAddress}</p>
      </section>

      <VerificationSteps steps={verificationSteps} />

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
