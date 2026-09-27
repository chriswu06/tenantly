import { Download } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { NextStepsSkeleton } from "@/components/tenant/NextSteps";
import { StatusPanelSkeleton } from "@/components/tenant/StatusPanel";
import { Stepper } from "@/components/tenant/Stepper";
import { HearingCardSkeleton } from "@/components/tenant/results/HearingCard";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { KeyValue, Panel, PanelHeaderSkeleton } from "@/components/tenant/results/Panel";
import { Button } from "@/components/ui/Button";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

export default function ResultsLoading() {
  return (
    <>
      <AppBar title="Results" backHref="/verify" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <Stepper current={3} />

        <ResultsSkeleton />

        <MobileActionBar>
          <Button
            disabled
            variant="secondary"
            aria-label="Download summary (PDF)"
            leadingIcon={Download}
            className="size-12 px-0"
          />
          <Button disabled size="responsive" className="min-w-0 flex-1">
            Request certification
          </Button>
        </MobileActionBar>
      </main>
    </>
  );
}

function ResultsSkeleton() {
  return (
    <LoadingRegion label="Loading your results" className="flex-1 px-5 py-4 md:px-6 md:py-8">
      <div className="mx-auto flex max-w-page flex-col gap-2.5 md:flex-row md:items-start md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:gap-5">
          <StatusPanelSkeleton lines={4} desktopLines={2} />

          {/* Mobile: case details */}
          <dl aria-hidden className="flex flex-col rounded-lg border border-border-default bg-bg-surface px-4 py-1 md:hidden">
            {["Property", "Hearing", "Records matched", "Reference"].map((label, index) => (
              <KeyValue key={label} label={label}>
                <SkeletonLines lines={index === 2 ? 3 : 1} />
              </KeyValue>
            ))}
          </dl>

          {/* Desktop: license records */}
          <Panel aria-hidden className="hidden md:flex">
            <PanelHeaderSkeleton titleClassName="w-64" />
            <div className="flex h-[34px] items-center border-b border-border-default bg-bg-app px-4">
              <Skeleton className="h-3 w-3/5" />
            </div>
            {[0, 1].map((row) => (
              <div key={row} className="flex h-11 items-center gap-4 border-b border-border-default px-4">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="ml-6 h-[22px] w-[72px]" />
                <Skeleton className="ml-8 h-3.5 w-20" />
                <Skeleton className="ml-12 h-3.5 w-20" />
                <Skeleton className="ml-12 h-3.5 w-32" />
              </div>
            ))}
            <div className="flex h-[42.4px] items-center gap-5 px-4">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-40" />
            </div>
          </Panel>

          <p className="hidden text-12 leading-[1.45] text-text-tertiary md:block">
            Informational only, not legal advice. An official DHCD certification is required as evidence
            in court.
          </p>
        </div>

        <aside className="flex flex-col gap-2.5 md:w-[300px] md:shrink-0 md:gap-4 lg:w-[360px]">
          <HearingCardSkeleton className="hidden md:flex" />
          <NextStepsSkeleton rows={3} mobileRows={4} />
          <Skeleton className="hidden h-[152px] rounded-[10px] md:block" />
          <Button disabled size="responsive" className="hidden md:flex">
            Request certification
          </Button>
          <Button disabled variant="secondary" size="responsive" leadingIcon={Download} className="hidden md:flex">
            Download summary (PDF)
          </Button>
        </aside>
      </div>
    </LoadingRegion>
  );
}

function SkeletonLines({ lines }: { lines: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="flex h-[18.2px] items-center">
          <Skeleton className={index === lines - 1 && lines > 1 ? "h-3 w-1/2" : "h-3 w-4/5"} />
        </div>
      ))}
    </div>
  );
}
