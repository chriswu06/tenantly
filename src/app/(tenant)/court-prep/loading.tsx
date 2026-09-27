import { ArrowRight, Download } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBarSkeleton } from "@/components/tenant/CaseBar";
import { CourtPrepChecklistSkeleton } from "@/components/tenant/CourtPrepChecklist";
import { HearingCardSkeleton } from "@/components/tenant/results/HearingCard";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { PageHeading, TwoColumn } from "@/components/tenant/results/PageHeading";
import { Button } from "@/components/ui/Button";
import { LoadingRegion } from "@/components/ui/Skeleton";

export default function CourtPrepLoading() {
  const actions = (
    <>
      <Button disabled size="responsive" leadingIcon={Download} className="w-full">
        Export checklist (PDF)
      </Button>
      <Button disabled variant="secondary" size="responsive" trailingIcon={ArrowRight} className="w-full">
        Continue to free legal help
      </Button>
    </>
  );

  return (
    <>
      <AppBar title="Court preparation" backHref="/certification" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBarSkeleton />

        <LoadingRegion label="Loading your court checklist" className="flex flex-1 flex-col">
          <TwoColumn
            main={
              <>
                <PageHeading
                  title="Court preparation"
                  description="Gather these documents before your hearing."
                  className="sr-only md:not-sr-only"
                />
                <CourtPrepChecklistSkeleton />
              </>
            }
            sidebar={
              <>
                <HearingCardSkeleton lines={2} withAction />
                <div className="hidden flex-col gap-3 md:flex">{actions}</div>
              </>
            }
            className="[&_aside]:order-first md:[&_aside]:order-none"
          />
        </LoadingRegion>

        <MobileActionBar>
          <div className="flex w-full flex-col gap-2.5">{actions}</div>
        </MobileActionBar>
      </main>
    </>
  );
}
