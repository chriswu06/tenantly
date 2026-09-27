import type { Metadata } from "next";
import Link from "next/link";
import { Check, Phone, Scale, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBar } from "@/components/tenant/CaseBar";
import { ConsentForm, type SharedItem } from "@/components/tenant/ConsentForm";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { PageHeading } from "@/components/tenant/results/PageHeading";
import { buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { withdrawShare } from "@/lib/cases/actions";
import { getTenantView, licenseResultCopy, listReferralOrganizations } from "@/lib/cases/tenant";

export const metadata: Metadata = { title: "Share with legal aid" };

const nextSteps: { icon: LucideIcon; text: string }[] = [
  { icon: Users, text: "A staff attorney reviews your case and license result." },
  { icon: Phone, text: "They contact you by phone before your hearing." },
  { icon: Scale, text: "If they take your case, they can help raise the defense in court." },
];

export default async function SharePage() {
  const [view, organizations] = await Promise.all([getTenantView(), listReferralOrganizations()]);
  const sharedItems: SharedItem[] = [
    { id: "address", label: "Property address", value: view.street, required: true },
    {
      id: "case",
      label: "Case number and court date",
      value: [view.caseNumber, view.hearing?.shortDate].filter(Boolean).join(" · "),
      required: true,
    },
    { id: "landlord", label: "Landlord name", value: view.landlordName, required: true },
    { id: "license", label: "License check result", value: licenseResultCopy(view).title, required: true },
  ];
  const orgs = organizations.map((org) => ({
    id: org.slug,
    name: org.name,
    short: org.short_description ?? "",
    detail: org.description ?? org.short_description ?? "",
  }));

  return (
    <>
      <AppBar title="Share with legal aid" backHref="/results" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBar reference={view.reference} address={view.street} />

        <div className="flex flex-1 flex-col md:px-6 md:pt-7 md:pb-12">
          <div className="mx-auto flex w-full max-w-page flex-1 flex-col md:flex-row md:items-start md:gap-8">
            <div className="flex min-w-0 flex-1 flex-col">
              {view.sharedWith ? (
                <SharedState orgName={view.sharedWith.name} phone={view.tenantPhone} />
              ) : (
                <ConsentForm
                  orgs={orgs}
                  items={sharedItems}
                  defaultFirstName={view.tenantFirstName ?? ""}
                  defaultPhone={view.tenantPhone ?? ""}
                  cancelHref="/results"
                />
              )}
            </div>

            <aside className="hidden shrink-0 flex-col gap-4 md:flex md:w-[300px] lg:w-[360px]">
              <section className="flex flex-col gap-3 rounded-[10px] border border-border-default bg-bg-surface p-4">
                <h2 className="text-14 leading-[1.45] font-semibold text-text-primary">What happens next</h2>
                <ul className="flex flex-col gap-3">
                  {nextSteps.map((step) => (
                    <li key={step.text} className="flex items-start gap-2.5 text-13 leading-[1.45] text-text-secondary">
                      <Icon icon={step.icon} size={16} className="mt-px text-accent" />
                      {step.text}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="flex flex-col gap-2 rounded-[10px] border border-border-default bg-bg-app p-4">
                <h2 className="flex items-center gap-2 text-14 leading-[1.45] font-semibold text-text-primary">
                  <Icon icon={ShieldCheck} size={16} className="text-success-fg" />
                  Your privacy
                </h2>
                <p className="text-13 leading-[1.45] text-text-secondary">
                  Only the organization you choose can see your case. If you don’t share, your case stays private and is
                  deleted automatically after your hearing.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

/** Already shared: say with whom, and offer to withdraw. */
function SharedState({ orgName, phone }: { orgName: string; phone: string | null }) {
  return (
    <div className="flex flex-col gap-3.5 p-5 md:gap-5 md:p-0">
      <PageHeading
        title="Your case is shared"
        description={`${orgName} can see your case${phone ? ` and will call you at ${phone}` : ""}. You can withdraw at any time.`}
      />
      <section className="flex items-center gap-3 rounded-lg border border-success-border bg-bg-surface p-4 md:rounded-[10px]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-bg text-success-fg">
          <Icon icon={Check} size={18} />
        </span>
        <p className="min-w-0 flex-1 text-14 leading-[1.45]">
          Shared with <span className="font-semibold">{orgName}</span>
        </p>
      </section>
      <div className="flex flex-col gap-2.5 md:flex-row md:justify-end md:gap-3">
        <form action={withdrawShare} className="flex md:contents">
          <SubmitButton className={buttonClassName("secondary", "responsive", "w-full md:h-[46px] md:w-auto md:px-[18px]")}>
            Withdraw sharing
          </SubmitButton>
        </form>
        <Link href="/results" className={buttonClassName("primary", "responsive", "w-full md:h-[46px] md:w-auto md:px-[18px]")}>
          Back to my results
        </Link>
      </div>
    </div>
  );
}
