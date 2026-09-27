import type { Metadata } from "next";
import { MessageSquare, Phone, Scale } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBar } from "@/components/tenant/CaseBar";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
import { PageHeading, TwoColumn } from "@/components/tenant/results/PageHeading";
import { Panel, PanelHeader } from "@/components/tenant/results/Panel";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { NextStepLink } from "@/components/tenant/results/NextStepLink";
import { legalContacts, resultsCase } from "@/lib/mock/results";

export const metadata: Metadata = { title: "Legal assistance" };

const providers = ["Tenant Volunteer Lawyer of the Day", "Public Justice Center attorneys"];

export default function LegalHelpPage() {
  return (
    <>
      <AppBar title="Legal assistance" backHref="/court-prep" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBar reference={resultsCase.reference} address={resultsCase.street} />

        <TwoColumn
          main={
            <>
              <PageHeading
                title="Free legal assistance"
                description="Volunteer attorneys are available at the courthouse during morning rent court dockets. No appointment needed."
              />

              <Panel>
                <PanelHeader
                  title={`At the courthouse · ${resultsCase.court}`}
                  action={
                    <Badge tone="ok" dot className="md:py-0.5">
                      Walk-in
                    </Badge>
                  }
                  className="justify-between"
                />
                <ul>
                  {providers.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0 md:gap-3.5 md:py-3.5"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-text-secondary md:size-10">
                        <Icon icon={Scale} size={18} className="md:hidden" />
                        <Icon icon={Scale} size={20} className="hidden md:block" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-14 leading-[1.3] font-medium text-text-primary md:leading-[1.45]">
                          {name}
                        </span>
                        <span className="text-12 leading-[1.4] text-text-tertiary md:leading-[1.45]">
                          First floor · Morning rent court dockets
                        </span>
                      </span>
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
                  {/* TODO: wire to read-aloud playback. */}
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
                <ul>
                  {legalContacts.map((contact) => (
                    <li
                      key={contact.name}
                      className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0"
                    >
                      <span className="min-w-0 flex-1 text-14 leading-[1.4] font-medium text-text-primary md:leading-[1.45]">
                        {contact.name}
                      </span>
                      <a
                        href={`tel:${contact.tel}`}
                        aria-label={`Call ${contact.name}`}
                        className="flex shrink-0 items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-13 leading-none font-medium text-text-primary hover:bg-bg-subtle"
                      >
                        <Icon icon={Phone} size={14} />
                        Call
                      </a>
                    </li>
                  ))}
                </ul>
              </Panel>
              <NextStepLink href="/outcome">After your hearing: report the outcome</NextStepLink>
              <p className="mt-auto pt-6 text-center text-12 leading-[1.4] text-text-tertiary md:pt-0 md:text-left md:leading-[1.45]">
                Informational only. Not legal advice.
              </p>
            </>
          }
          // Mobile: fill the screen so the disclaimer sits at the bottom (Figma 09 spacer).
          className="flex flex-col md:block [&>div]:flex-1 [&_aside]:flex-1 md:[&_aside]:flex-none"
        />
      </main>
    </>
  );
}
