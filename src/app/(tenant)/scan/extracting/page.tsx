import Link from "next/link";
import { TrustNote } from "@/components/tenant/TrustNote";
import { AutoAdvance } from "@/components/tenant/scan/AutoAdvance";
import { DocThumb } from "@/components/tenant/scan/DocThumb";
import { FieldStatusList } from "@/components/tenant/scan/FieldStatusList";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";
import { extractionFields, extractionProgress, uploadedFile } from "@/lib/mock/scan";

export default function ExtractingPage() {
  const { done, total } = extractionProgress;

  return (
    <FlowLayout title="Scan summons" backHref="/scan/capture" step={0} className="gap-4 p-5 md:gap-5 md:px-0">
      <AutoAdvance href="/scan/review" />
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
            <p className="truncate text-14 font-medium">{uploadedFile.name}</p>
            <p className="text-12 text-text-tertiary">{uploadedFile.meta}</p>
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
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="h-1.5 overflow-hidden rounded-[3px] bg-bg-subtle"
          >
            <div className="h-full rounded-[3px] bg-accent" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <div className="flex justify-between text-12 leading-[1.4] text-text-secondary md:leading-[1.45]">
            <span>Extracting fields</span>
            <span className="font-medium">
              {done} of {total}
            </span>
          </div>
        </div>
      </section>

      <FieldStatusList fields={extractionFields} />

      <div className="flex-1 md:hidden" />
      <TrustNote align="start">The image is processed in memory and deleted after extraction.</TrustNote>
    </FlowLayout>
  );
}
