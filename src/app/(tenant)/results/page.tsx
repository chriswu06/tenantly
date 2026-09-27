import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Database, Download, FileText, Folder, Scale, Users } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { NextSteps, type NextStep } from "@/components/tenant/NextSteps";
import { StatusPanel } from "@/components/tenant/StatusPanel";
import { Stepper } from "@/components/tenant/Stepper";
import { HearingCard } from "@/components/tenant/results/HearingCard";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";
import { KeyValue, Panel, PanelHeader } from "@/components/tenant/results/Panel";

import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Table, TableHead, Td, Th, Tr } from "@/components/ui/Table";
import { licenseRecords, resultsCase } from "@/lib/mock/results";
import { buttonClassName } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Results" };

const steps: NextStep[] = [
  { href: "/certification", icon: FileText, label: "Request DHCD certification", description: "417 E Fayette St, Room 100" },
  { href: "/court-prep", icon: Folder, label: "Prepare court documents", description: "6-item checklist" },
  { href: "/legal-help", icon: Scale, label: "Free legal assistance", description: "Volunteer attorneys at court" },
  { href: "/share", icon: Users, label: "Share case with legal aid", accent: true, mobileOnly: true },
];

const summaryPdfHref = `/api/cases/${resultsCase.reference}/report?type=summary`;

export default function ResultsPage() {
  const { hearing } = resultsCase;

  return (
    <>
      <AppBar title="Results" backHref="/verify" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <Stepper current={3} />

        <div className="flex-1 px-5 py-4 md:px-6 md:py-8">
          <div className="mx-auto flex max-w-page flex-col gap-2.5 md:flex-row md:items-start md:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:gap-5">
              <StatusPanel
                tone="ok"
                badge="Possible defense"
                title="No active rental license found"
                titleAs="h1"
                description={
                  <>
                    <span className="md:hidden">
                      DHCD records show no active license for this address on the filing date (
                      {resultsCase.filingDate}). The landlord may not be permitted to pursue this case.
                      Informational only, not legal advice.
                    </span>
                    <span className="hidden md:inline">
                      DHCD records show no active license on the filing date. The landlord may not be
                      permitted to pursue this case.
                    </span>
                  </>
                }
              />

              {/* Mobile: case details */}
              <dl className="flex flex-col rounded-lg border border-border-default bg-bg-surface px-4 py-1 md:hidden">
                <KeyValue label="Property">{resultsCase.street}</KeyValue>
                <KeyValue label="Hearing">{hearing.dateTime}</KeyValue>
                <KeyValue label="Records matched">
                  0 active · 2 expired (last 03/31/2025) · Checked Sep 26, 10:52 PM
                </KeyValue>
                <KeyValue label="Reference">
                  <span className="font-mono font-normal">{resultsCase.reference}</span>
                </KeyValue>
              </dl>

              {/* Desktop: license records */}
              <Panel className="hidden md:flex">
                <PanelHeader title={`License records for ${resultsCase.street}`} />
                <Table>
                  <TableHead>
                    <tr>
                      <Th className="h-[34px] w-[170px]">License #</Th>
                      <Th className="h-[34px] w-[130px]">Status</Th>
                      <Th className="h-[34px] w-[130px]">Valid from</Th>
                      <Th className="h-[34px] w-[130px]">Valid to</Th>
                      <Th className="h-[34px]">Source</Th>
                    </tr>
                  </TableHead>
                  <tbody>
                    {licenseRecords.map((record) => (
                      <Tr key={record.number} className="hover:bg-transparent">
                        <Td className="h-11 font-mono text-text-primary">{record.number}</Td>
                        <Td className="h-11">
                          <Badge tone={record.status === "active" ? "ok" : "danger"} dot className="py-0.5">
                            {record.status === "active" ? "Active" : "Expired"}
                          </Badge>
                        </Td>
                        <Td className="h-11 text-text-primary">{record.validFrom}</Td>
                        <Td className="h-11 text-text-primary">{record.validTo}</Td>
                        <Td className="h-11">{record.source}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                <div className="flex flex-wrap gap-x-5 gap-y-1 px-4 py-3 text-12 leading-[1.45] text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <Icon icon={Clock} size={14} />
                    Checked {resultsCase.checkedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon icon={Database} size={14} />
                    Reference {resultsCase.reference}
                  </span>
                </div>
              </Panel>

              <p className="hidden text-12 leading-[1.45] text-text-tertiary md:block">
                Informational only, not legal advice. An official DHCD certification is required as evidence
                in court.
              </p>
            </div>

            <aside className="flex flex-col gap-2.5 md:w-[300px] md:shrink-0 md:gap-4 lg:w-[360px]">
              <HearingCard
                className="hidden md:flex"
                month={hearing.month}
                day={hearing.day}
                title={`Hearing in ${hearing.daysAway} days`}
                lines={[`${hearing.dateTime} · ${hearing.courtAddress}`]}
              />

              <NextSteps steps={steps} />

              <section className="hidden flex-col gap-2.5 rounded-[10px] border border-accent-border bg-accent-subtle p-4 md:flex">
                <h2 className="flex items-center gap-2 text-14 leading-[1.45] font-semibold text-text-primary">
                  <Icon icon={Users} size={18} className="text-accent" />
                  Want a lawyer to review this?
                </h2>
                <p className="text-13 leading-[1.45] text-text-secondary">
                  Share your case with a legal aid organization and they can call you before your hearing.
                </p>
                <Link
                  href="/share"
                  className="flex h-10 items-center justify-center rounded-lg border border-accent-border bg-bg-surface text-14 font-semibold text-accent hover:bg-accent-subtle"
                >
                  Share my case
                </Link>
              </section>

              <Link href="/certification" className={buttonClassName("primary", "responsive", "hidden md:flex")}>
                Request certification
              </Link>
              <a href={summaryPdfHref} download className={buttonClassName("secondary", "responsive", "hidden md:flex")}>
                <Icon icon={Download} size={18} />
                Download summary (PDF)
              </a>
            </aside>
          </div>
        </div>

        <MobileActionBar>
          <a href={summaryPdfHref} download
            aria-label="Download summary (PDF)"
            className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-bg-surface text-text-primary hover:bg-bg-subtle"
          >
            <Icon icon={Download} size={18} />
          </a>
          <Link href="/certification" className={buttonClassName("primary", "responsive", "min-w-0 flex-1")}>
            Request certification
          </Link>
        </MobileActionBar>
      </main>
    </>
  );
}
