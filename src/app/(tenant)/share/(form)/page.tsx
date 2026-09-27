import type { Metadata } from "next";
import { Phone, Scale, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { CaseBar } from "@/components/tenant/CaseBar";
import { ConsentForm, type SharedItem } from "@/components/tenant/ConsentForm";
import { Icon } from "@/components/ui/Icon";
import { legalAidOrgs, resultsCase, tenantContact } from "@/lib/mock/results";

export const metadata: Metadata = { title: "Share with legal aid" };

const sharedItems: SharedItem[] = [
  { id: "address", label: "Property address", value: resultsCase.street, required: true },
  {
    id: "case",
    label: "Case number and court date",
    value: `${resultsCase.caseNumber} · ${resultsCase.hearing.shortDate}`,
    required: true,
  },
  { id: "landlord", label: "Landlord name", value: resultsCase.landlordName, required: true },
  { id: "license", label: "License check result", value: "No active license found", required: true },
  { id: "summons-photo", label: "Photo of your summons", value: "Helps the lawyer review details", required: false },
];

const nextSteps: { icon: LucideIcon; text: string }[] = [
  { icon: Users, text: "A staff attorney reviews your case and license result." },
  { icon: Phone, text: "They contact you by phone before your hearing." },
  { icon: Scale, text: "If they take your case, they can help raise the defense in court." },
];

export default function SharePage() {
  return (
    <>
      <AppBar title="Share with legal aid" backHref="/results" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBar reference={resultsCase.reference} address={resultsCase.street} />

        <div className="flex flex-1 flex-col md:px-6 md:pt-7 md:pb-12">
          <div className="mx-auto flex w-full max-w-page flex-1 flex-col md:flex-row md:items-start md:gap-8">
            <div className="flex min-w-0 flex-1 flex-col">
              <ConsentForm
                orgs={legalAidOrgs}
                items={sharedItems}
                defaultFirstName={tenantContact.firstName}
                defaultPhone={tenantContact.phone}
                cancelHref="/results"
                confirmationPath="/share/confirmation"
              />
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
                  Only the organization you choose can see your case. If you don’t share, nothing is saved after
                  you leave this page.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
