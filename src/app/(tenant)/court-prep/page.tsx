import type { Metadata } from "next";
import { Calendar, Download } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBar } from "@/components/tenant/CaseBar";
import { CourtPrepChecklist } from "@/components/tenant/CourtPrepChecklist";
import { HearingCard } from "@/components/tenant/results/HearingCard";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { PageHeading, TwoColumn } from "@/components/tenant/results/PageHeading";

import { Icon } from "@/components/ui/Icon";
import { NextStepLink } from "@/components/tenant/results/NextStepLink";
import { courtChecklist, hearingIcsHref, resultsCase } from "@/lib/mock/results";
import { buttonClassName } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Court preparation" };

export default function CourtPrepPage() {
  const { hearing } = resultsCase;

  const exportButton = (
    <a href={`/api/cases/${resultsCase.reference}/report?type=checklist`} download className={buttonClassName("primary", "responsive", "w-full")}>
      <Icon icon={Download} size={18} />
      Export checklist (PDF)
    </a>
  );

  return (
    <>
      <AppBar title="Court preparation" backHref="/certification" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBar reference={resultsCase.reference} address={resultsCase.street} />

        <TwoColumn
          main={
            <>
              <PageHeading
                title="Court preparation"
                description="Gather these documents before your hearing."
                className="sr-only md:not-sr-only"
              />
              <CourtPrepChecklist items={courtChecklist} />
            </>
          }
          sidebar={
            <>
              <HearingCard
                month={hearing.month}
                day={hearing.day}
                title="Rent court hearing"
                lines={[`${hearing.dateTime} · ${hearing.arrive}`, hearing.courtName]}
              >
                <a
                  href={hearingIcsHref()}
                  download="rent-court-hearing.ics"
                  className="flex items-center gap-1.5 self-start rounded-md text-13 leading-[1.4] font-semibold text-accent hover:underline md:leading-[1.45]"
                >
                  <Icon icon={Calendar} size={16} />
                  Add to calendar (.ics)
                </a>
              </HearingCard>
              <div className="hidden flex-col gap-3 md:flex">
                {exportButton}
                <NextStepLink href="/legal-help">Continue to free legal help</NextStepLink>
              </div>
            </>
          }
          className="[&_aside]:order-first md:[&_aside]:order-none"
        />

        <MobileActionBar>
          <div className="flex w-full flex-col gap-2.5">
            {exportButton}
            <NextStepLink href="/legal-help">Continue to free legal help</NextStepLink>
          </div>
        </MobileActionBar>
      </main>
    </>
  );
}
