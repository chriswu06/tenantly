import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { ExtractedFieldsForm } from "@/components/tenant/ExtractedFieldsForm";
import { SummonsPreview } from "@/components/tenant/SummonsPreview";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";

import { getReviewValues, reviewConfidence, uploadedFile } from "@/lib/mock/scan";
import { buttonClassName } from "@/components/ui/Button";

export default function ReviewPage() {
  return (
    <FlowLayout
      title="Review details"
      backHref="/scan/capture"
      step={1}
      width="wide"
      className="gap-2.5 p-5 md:gap-8 md:px-0 lg:flex-row lg:items-start"
      mobileFooter={
        <Link href="/verify" className={buttonClassName("primary", "lg", "w-full")}>
          Verify license
          <Icon icon={ArrowRight} size={18} />
        </Link>
      }
    >
      <div className="contents md:flex md:flex-col md:gap-4.5 lg:order-2 lg:min-w-0 lg:flex-1">
        <PageHeading title="Review extracted details">
          <span className="md:hidden">Correct anything that doesn’t match your summons.</span>
          <span className="hidden md:inline">
            Compare with your document on the left. Highlighted areas show where each value was read.
          </span>
        </PageHeading>
        <SummonsPreview fileName={uploadedFile.name} className="md:hidden" />
        <ExtractedFieldsForm defaultValues={getReviewValues()} confidence={reviewConfidence} />
        <div className="hidden justify-end gap-3 pt-2 md:flex">
          <Link href="/scan/capture" className={buttonClassName("secondary", "md")}>
            Back
          </Link>
          <Link href="/verify" className={buttonClassName("primary", "md")}>
            Verify license
            <Icon icon={ArrowRight} size={18} />
          </Link>
        </div>
      </div>
      <SummonsPreview fileName={uploadedFile.name} className="hidden md:block lg:order-1 lg:w-[520px] lg:shrink-0" />
    </FlowLayout>
  );
}
