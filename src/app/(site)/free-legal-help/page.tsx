import type { Metadata } from "next";
import { MessageSquare, Phone, Scale } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { marylandLegalAid, publicJusticeCenter } from "@/lib/contacts";

export const metadata: Metadata = { title: "Free legal help" };

const providers = ["Tenant Volunteer Lawyer of the Day", "Public Justice Center attorneys"];

const contacts = [marylandLegalAid, publicJusticeCenter];

const panelClass = "overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]";
const panelHeaderClass =
  "flex items-center gap-2 border-b border-border-default px-4 py-3 md:h-12 md:py-0";
const panelTitleClass = "min-w-0 flex-1 text-14 leading-[1.4] font-semibold md:leading-[1.45]";

export default function FreeLegalHelpPage() {
  return (
    <>
      <AppBar title="Free legal help" backHref="/" className="shrink-0 md:hidden" />
      <main className="flex w-full flex-1 flex-col gap-3.5 p-5 md:mx-auto md:max-w-[1200px] md:flex-none md:flex-row md:items-start md:gap-8 md:px-6 md:pt-7 md:pb-12">
        <div className="flex min-w-0 flex-col gap-3.5 md:flex-1 md:gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-22 font-semibold md:text-28 md:leading-[1.2] md:tracking-[-0.42px]">
              Free legal assistance
            </h1>
            <p className="text-15 leading-[1.45] text-text-secondary">
              Volunteer attorneys are available at the courthouse during morning rent court dockets. No appointment
              needed.
            </p>
          </div>

          <section className={panelClass}>
            <div className={panelHeaderClass}>
              <h2 className={panelTitleClass}>At the courthouse · District Court, 501 E Fayette St</h2>
              <Badge tone="ok" dot>
                Walk-in
              </Badge>
            </div>
            <ul className="divide-y divide-border-default">
              {providers.map((name) => (
                <li key={name} className="flex items-center gap-3 px-4 py-3 md:gap-3.5 md:py-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-text-secondary md:size-10">
                    <Icon icon={Scale} size={18} className="md:hidden" />
                    <Icon icon={Scale} size={20} className="hidden md:block" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-14 leading-[1.3] font-medium md:leading-[1.45]">{name}</p>
                    <p className="text-12 leading-[1.4] text-text-tertiary md:leading-[1.45]">
                      First floor · Morning rent court dockets
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${panelClass} flex flex-col gap-2 p-3.5 md:gap-0 md:p-0`}>
            <div className="flex items-center gap-2 md:h-12 md:border-b md:border-border-default md:px-4">
              <Icon icon={MessageSquare} size={16} className="text-text-secondary md:hidden" />
              <h2 className={panelTitleClass}>What to say to the attorney</h2>
              <ReadAloudButton variant="inline" />
            </div>
            <div className="md:p-4">
              <blockquote className="border-l-3 border-accent py-1 pl-3 text-14 leading-[1.5] md:pl-3.5 md:text-16">
                “My landlord doesn’t have an active rental license. Can you help me raise that defense?”
              </blockquote>
            </div>
          </section>
        </div>

        <aside className="flex flex-1 flex-col gap-3.5 md:w-[360px] md:flex-none md:shrink-0 md:gap-4">
          <section className={panelClass}>
            <div className={panelHeaderClass}>
              <h2 className={panelTitleClass}>Before court day</h2>
            </div>
            <ul className="divide-y divide-border-default">
              {contacts.map(({ name, tel }) => (
                <li key={name} className="flex items-center gap-3 px-4 py-3">
                  <p className="min-w-0 flex-1 text-14 leading-[1.4] font-medium md:leading-[1.45]">{name}</p>
                  <a
                    href={`tel:${tel}`}
                    aria-label={`Call ${name}`}
                    className="flex shrink-0 items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-13 leading-none font-medium hover:bg-bg-subtle"
                  >
                    <Icon icon={Phone} size={14} />
                    Call
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <p className="mt-auto text-center text-12 leading-[1.4] text-text-tertiary md:mt-0 md:text-left md:leading-[1.45]">
            Informational only. Not legal advice.
          </p>
        </aside>
      </main>
    </>
  );
}
