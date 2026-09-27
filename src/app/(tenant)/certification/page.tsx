import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, MapPin } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBar } from "@/components/tenant/CaseBar";
import { CopyButton } from "@/components/tenant/results/CopyButton";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { PageHeading, TwoColumn } from "@/components/tenant/results/PageHeading";
import { KeyValue, Panel, PanelHeader } from "@/components/tenant/results/Panel";

import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { buttonClassName } from "@/components/ui/Button";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { markCertificationRequested } from "@/lib/cases/actions";
import { formatDateTime } from "@/lib/cases/format";
import { dhcdOffice, getTenantView, hearingInDays } from "@/lib/cases/tenant";

export const metadata: Metadata = { title: "Request certification" };

const kvRow = "py-2.5 md:gap-4 md:px-4 md:py-3 md:leading-[1.45]";
const kvLabel = "w-24 md:w-[120px]";

export default async function CertificationPage() {
  const view = await getTenantView();
  const { hearing } = view;
  const requested = view.certificationRequestedAt;
  const requestText = [
    [view.street, view.cityLine].filter(Boolean).join(", "),
    `Case ${view.caseNumber} · Filed ${view.filingDate}`,
  ].join("\n");

  const directions = (
    <a href={dhcdOffice.mapsHref} target="_blank" rel="noreferrer" className={buttonClassName("secondary", "responsive", "min-w-0 flex-1 md:w-full md:flex-none")}>
      <Icon icon={MapPin} size={18} />
      Get directions
    </a>
  );
  const markRequested = requested ? (
    <Link href="/court-prep" className={buttonClassName("primary", "responsive", "min-w-0 flex-1 md:w-full md:flex-none")}>
      Continue to court prep
    </Link>
  ) : (
    <form action={markCertificationRequested} className="flex min-w-0 flex-1 md:w-full md:flex-none">
      <SubmitButton icon={<Icon icon={Check} size={18} />} className={buttonClassName("primary", "responsive", "w-full")}>
        Mark as requested
      </SubmitButton>
    </form>
  );

  return (
    <>
      <AppBar title="Request certification" backHref="/results" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBar reference={view.reference} address={view.street} />

        <TwoColumn
          main={
            <>
              <PageHeading
                title="Request DHCD certification"
                description="The official certification is the document the court accepts as evidence that your landlord was unlicensed."
              />

              <Panel className="px-4 py-1 md:p-0">
                <PanelHeader title={dhcdOffice.name} className="border-b-0 px-0 pt-3 pb-2 md:border-b md:px-4" />
                <dl>
                  <KeyValue label="Address" className={kvRow} labelClassName={kvLabel}>
                    <span className="md:hidden">{dhcdOffice.address}</span>
                    <span className="hidden md:inline">{dhcdOffice.fullAddress}</span>
                  </KeyValue>
                  <KeyValue label="Hours" className={kvRow} labelClassName={kvLabel}>
                    Weekdays from 8:30 AM
                  </KeyValue>
                  <KeyValue
                    label={
                      <>
                        <span className="md:hidden">Ask for</span>
                        <span className="hidden md:inline">What to ask for</span>
                      </>
                    }
                    className={kvRow}
                    labelClassName={kvLabel}
                  >
                    Rental license certification<span className="hidden md:inline"> for the address below</span>
                  </KeyValue>
                  <KeyValue label="Bring" className={kvRow} labelClassName={kvLabel}>
                    Photo ID and your summons
                  </KeyValue>
                </dl>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Request details"
                  action={<CopyButton text={requestText} />}
                  className="border-b-0 px-3.5 pt-3.5 pb-0 md:border-b md:px-4"
                />
                <div className="px-3.5 pt-2 pb-3.5 font-mono text-13 leading-[1.6] text-text-primary md:p-4 md:leading-[1.7]">
                  <p>
                    {view.street}
                    <span className="md:hidden">
                      <br />
                    </span>
                    <span className="hidden md:inline">, </span>
                    {view.cityLine}
                  </p>
                  <p>
                    Case {view.caseNumber}
                    <span className="md:hidden">
                      <br />
                    </span>
                    <span className="hidden md:inline"> · </span>
                    Filed {view.filingDate}
                  </p>
                </div>
              </Panel>
            </>
          }
          sidebar={
            <>
              {hearing && (
                <Alert
                  tone="warn"
                  icon={Clock}
                  title={hearingInDays(hearing.daysAway, "Court date")}
                  className="md:gap-3 md:rounded-[10px] md:p-4 md:[&>div]:gap-1 md:[&>div>p:first-child]:text-14 md:[&>div>p:first-child]:leading-[1.45] md:[&>div>div]:leading-[1.5]"
                >
                  If the certification won’t arrive in time, bring your request receipt and tell the volunteer
                  attorney at court.
                </Alert>
              )}

              <Panel className="hidden md:flex">
                <PanelHeader
                  title="Status"
                  action={
                    requested ? (
                      <Badge tone="ok" dot className="py-0.5">
                        Requested
                      </Badge>
                    ) : (
                      <Badge tone="neutral" dot className="py-0.5">
                        Not requested
                      </Badge>
                    )
                  }
                />
                <div className="flex flex-col gap-2.5 p-4">
                  {requested && (
                    <p className="text-13 leading-[1.45] text-text-secondary">
                      You marked it requested on {formatDateTime(requested)}.
                    </p>
                  )}
                  {markRequested}
                  {directions}
                </div>
              </Panel>
            </>
          }
        />

        <MobileActionBar>
          {directions}
          {markRequested}
        </MobileActionBar>
      </main>
    </>
  );
}
