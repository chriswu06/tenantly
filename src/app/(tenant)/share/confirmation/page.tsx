import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBar } from "@/components/tenant/CaseBar";
import { MobileActionBar } from "@/components/tenant/results/MobileActionBar";

import { findOrg, resultsCase, tenantContact } from "@/lib/mock/results";
import { buttonClassName } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Case shared" };

type ConfirmationPageProps = {
  searchParams: Promise<{ org?: string | string[] }>;
};

export default async function ShareConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { org: orgParam } = await searchParams;
  const org = findOrg(Array.isArray(orgParam) ? orgParam[0] : orgParam);

  const details = [
    { label: "Reference", value: <span className="font-mono font-normal">{resultsCase.reference}</span> },
    { label: "Shared with", value: org.name },
    { label: "Hearing", value: resultsCase.hearing.dateTime },
  ];

  const actions = (
    <>
      {/* TODO: call the withdraw endpoint. Static build: back to the consent form. */}
      <Link href="/share" className={buttonClassName("secondary", "responsive", "min-w-0 flex-1 md:h-[46px] md:px-[18px]")}>
        Withdraw sharing
      </Link>
      <Link href="/results" className={buttonClassName("primary", "responsive", "min-w-0 flex-1 md:h-[46px] md:px-[18px]")}>
        Back to my results
      </Link>
    </>
  );

  return (
    <>
      <AppBar title="Case shared" backHref="/share" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBar reference={resultsCase.reference} address={resultsCase.street} />

        <div className="flex flex-1 flex-col items-center px-5 pt-10 pb-5 md:px-6 md:pt-14 md:pb-12">
          <section className="flex w-full flex-col items-center gap-4 text-center md:max-w-[560px] md:gap-[18px] md:rounded-xl md:border md:border-border-default md:bg-bg-surface md:p-8">
            <span className="flex size-14 items-center justify-center rounded-full bg-success-bg text-success-fg">
              <Check size={28} aria-hidden />
            </span>
            <h1 className="text-22 leading-[1.25] font-semibold tracking-[-0.22px] text-text-primary">
              Your case was shared with {org.name}
            </h1>
            <p className="text-15 leading-[1.45] text-text-secondary md:text-14">
              A staff attorney will review it and call you at {tenantContact.phone}. Keep your phone on,
              including numbers you don’t recognize.
            </p>
            <dl className="flex w-full flex-col rounded-lg border border-border-default bg-bg-surface text-left text-13 leading-[1.45]">
              {details.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-3 border-b border-border-default px-3.5 py-3 last:border-b-0 md:py-[11px]"
                >
                  <dt className="text-text-secondary">{row.label}</dt>
                  <dd className="text-right font-medium text-text-primary">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="hidden w-full gap-3 md:flex">{actions}</div>
            <p className="text-13 leading-[1.45] text-text-tertiary md:text-12">
              Still go to your hearing. Sharing your case does not postpone it.
            </p>
          </section>
        </div>

        <MobileActionBar>{actions}</MobileActionBar>
      </main>
    </>
  );
}
