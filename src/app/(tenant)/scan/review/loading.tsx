import { ArrowRight } from "lucide-react";
import { ExtractedFieldsFormSkeleton } from "@/components/tenant/ExtractedFieldsForm";
import { SummonsPreviewSkeleton } from "@/components/tenant/SummonsPreview";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";
import { Button } from "@/components/ui/Button";
import { LoadingRegion } from "@/components/ui/Skeleton";

export default function ReviewLoading() {
  return (
    <FlowLayout
      title="Review details"
      backHref="/"
      step={1}
      width="wide"
      className="gap-2.5 p-5 md:gap-8 md:px-0 lg:flex-row lg:items-start"
      mobileFooter={
        <Button disabled size="lg" trailingIcon={ArrowRight} className="w-full">
          Verify license
        </Button>
      }
    >
      <div className="contents md:flex md:flex-col md:gap-4.5 lg:order-2 lg:min-w-0 lg:flex-1">
        <PageHeading title="Review your summons details">Loading your details…</PageHeading>
        <LoadingRegion label="Loading extracted details" className="flex flex-col gap-2.5">
          <SummonsPreviewSkeleton className="md:hidden" />
          <ExtractedFieldsFormSkeleton />
        </LoadingRegion>
        <div className="hidden justify-end gap-3 pt-2 md:flex">
          <Button disabled variant="secondary" size="md">
            Back
          </Button>
          <Button disabled size="md" trailingIcon={ArrowRight}>
            Verify license
          </Button>
        </div>
      </div>
      <SummonsPreviewSkeleton className="hidden md:block lg:order-1 lg:w-[360px] lg:shrink-0" />
    </FlowLayout>
  );
}
