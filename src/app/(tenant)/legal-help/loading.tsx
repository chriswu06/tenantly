import { ArrowRight, MessageSquare } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBarSkeleton } from "@/components/tenant/CaseBar";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
import { PageHeading, TwoColumn } from "@/components/tenant/results/PageHeading";
import { Panel, PanelHeader, PanelHeaderSkeleton } from "@/components/tenant/results/Panel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

export default function LegalHelpLoading() {
  return (
    <>
      <AppBar title="Legal assistance" backHref="/court-prep" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBarSkeleton />

        <LoadingRegion label="Loading legal help contacts" className="flex flex-1 flex-col">
          <TwoColumn
            main={
              <>
                <PageHeading
                  title="Free legal assistance"
                  description="Volunteer attorneys are available at the courthouse during morning rent court dockets. No appointment needed."
                />

                <Panel aria-hidden>
                  <PanelHeaderSkeleton
                    titleClassName="w-52 md:w-80"
                    mobileLines={2}
                    action={<Skeleton className="h-[22.4px] w-[66px] md:h-[20.4px]" />}
                    className="justify-between"
                  />
                  <ul>
                    {["w-48", "w-44"].map((width) => (
                      <li
                        key={width}
                        className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0 md:gap-3.5 md:py-3.5"
                      >
                        <Skeleton className="size-9 shrink-0 rounded-lg md:size-10" />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="flex h-[18.2px] items-center md:h-[20.3px]">
                            <Skeleton className={`h-3.5 ${width}`} />
                          </div>
                          <div className="flex h-[16.8px] items-center md:h-[17.4px]">
                            <Skeleton className="h-3 w-52 max-w-full" />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel className="gap-2 p-3.5 md:gap-0 md:p-0">
                  <div className="flex items-center gap-2 md:h-12 md:border-b md:border-border-default md:px-4">
                    <Icon icon={MessageSquare} size={16} className="text-text-secondary md:hidden" />
                    <h2 className="min-w-0 flex-1 text-14 leading-[1.4] font-semibold text-text-primary md:leading-[1.45]">
                      What to say to the attorney
                    </h2>
                    <ReadAloudButton variant="inline" />
                  </div>
                  <div className="md:p-4">
                    <blockquote className="border-l-3 border-accent py-1 pl-3 text-14 leading-[1.5] text-text-primary md:pl-3.5 md:text-16">
                      “My landlord doesn’t have an active rental license. Can you help me raise that defense?”
                    </blockquote>
                  </div>
                </Panel>
              </>
            }
            sidebar={
              <>
                <Panel>
                  <PanelHeader title="Before court day" />
                  <ul aria-hidden>
                    {["w-36", "w-40"].map((width) => (
                      <li
                        key={width}
                        className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0"
                      >
                        <div className="flex h-[19.6px] min-w-0 flex-1 items-center md:h-[20.3px]">
                          <Skeleton className={`h-3.5 ${width}`} />
                        </div>
                        <Skeleton className="h-[28px] w-[65px]" />
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Button disabled variant="secondary" size="responsive" trailingIcon={ArrowRight} className="w-full">
                  After your hearing: report the outcome
                </Button>
                <p className="mt-auto pt-6 text-center text-12 leading-[1.4] text-text-tertiary md:pt-0 md:text-left md:leading-[1.45]">
                  Informational only. Not legal advice.
                </p>
              </>
            }
            className="flex flex-col md:block [&>div]:flex-1 [&_aside]:flex-1 md:[&_aside]:flex-none"
          />
        </LoadingRegion>
      </main>
    </>
  );
}
