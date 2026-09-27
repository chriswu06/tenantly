import { Check, MapPin } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBarSkeleton } from "@/components/tenant/CaseBar";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { PageHeading, TwoColumn } from "@/components/tenant/results/PageHeading";
import { KeyValue, Panel, PanelHeader, PanelHeaderSkeleton } from "@/components/tenant/results/Panel";
import { Button } from "@/components/ui/Button";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

const kvRow = "py-2.5 md:gap-4 md:px-4 md:py-3 md:leading-[1.45]";
const kvLabel = "w-24 md:w-[120px]";
const officeRows = [
  { key: "address", label: "Address", width: "w-40 md:w-64" },
  { key: "hours", label: "Hours", width: "w-36" },
  {
    key: "ask",
    label: (
      <>
        <span className="md:hidden">Ask for</span>
        <span className="hidden md:inline">What to ask for</span>
      </>
    ),
    width: "w-44 md:w-72",
  },
  { key: "bring", label: "Bring", width: "w-40" },
];

const actionClass = "min-w-0 flex-1 md:w-full md:flex-none";

export default function CertificationLoading() {
  const directions = (
    <Button disabled variant="secondary" size="responsive" leadingIcon={MapPin} className={actionClass}>
      Get directions
    </Button>
  );
  const markRequested = (
    <Button disabled size="responsive" leadingIcon={Check} className={actionClass}>
      Mark as requested
    </Button>
  );

  return (
    <>
      <AppBar title="Request certification" backHref="/results" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBarSkeleton />

        <LoadingRegion label="Loading certification details" className="flex flex-1 flex-col">
          <TwoColumn
            main={
              <>
                <PageHeading
                  title="Request DHCD certification"
                  description="The official certification is the document the court accepts as evidence that your landlord was unlicensed."
                />

                <Panel aria-hidden className="px-4 py-1 md:p-0">
                  <PanelHeaderSkeleton
                    titleClassName="w-56"
                    className="border-b-0 px-0 pt-3 pb-2 md:border-b md:px-4"
                  />
                  <dl>
                    {officeRows.map(({ key, label, width }) => (
                      <KeyValue key={key} label={label} className={kvRow} labelClassName={kvLabel}>
                        <div className="flex h-[18.2px] items-center md:h-[18.85px]">
                          <Skeleton className={`h-3 ${width}`} />
                        </div>
                      </KeyValue>
                    ))}
                  </dl>
                </Panel>

                <Panel aria-hidden>
                  <PanelHeader
                    title="Request details"
                    action={<Skeleton className="h-6 w-[68px] md:h-[22px]" />}
                    className="border-b-0 px-3.5 pt-3.5 pb-0 md:border-b md:px-4"
                  />
                  {/* Four lines on mobile, two from md, like the real text. */}
                  <div className="flex flex-col px-3.5 pt-2 pb-3.5 md:p-4">
                    {["w-48", "w-36", "w-40", "w-32"].map((width, index) => (
                      <div key={index} className={`flex h-[20.8px] items-center md:h-[22.1px] ${index > 1 ? "md:hidden" : ""}`}>
                        <Skeleton className={`h-3 ${width} ${index === 0 ? "md:w-80" : index === 1 ? "md:w-72" : ""}`} />
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            }
            sidebar={
              <>
                <Skeleton className="h-[102px] rounded-lg md:h-[117px] md:rounded-[10px]" />

                <Panel className="hidden md:flex">
                  <PanelHeader title="Status" action={<Skeleton className="h-[20.4px] w-28" />} />
                  <div className="flex flex-col gap-2.5 p-4">
                    {markRequested}
                    {directions}
                  </div>
                </Panel>
              </>
            }
          />
        </LoadingRegion>

        <MobileActionBar>
          {directions}
          {markRequested}
        </MobileActionBar>
      </main>
    </>
  );
}
