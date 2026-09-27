import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, MapPin, Pencil, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";

import { buttonClassName } from "@/components/ui/Button";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { startOver } from "@/lib/cases/actions";
import { requireTenantCase } from "@/lib/cases/session";
import { normalizedAddressOf } from "@/lib/cases/tenant";
import { courtHelpCenter, marylandLegalAid, peoplesLawLibraryUrl } from "@/lib/contacts";

export const metadata: Metadata = { title: "Outside Baltimore City", robots: { index: false, follow: false } };

const outsideAreaResources = [
  { name: marylandLegalAid.name, detail: "Free civil legal help statewide", action: "call", href: `tel:${marylandLegalAid.tel}` },
  {
    name: "Maryland People’s Law Library",
    detail: "Plain-language guides to landlord-tenant law",
    action: "open",
    href: peoplesLawLibraryUrl,
  },
  { name: "District Court Self-Help Center", detail: "Free help by phone or chat", action: "call", href: `tel:${courtHelpCenter.tel}` },
] as const;

export default async function OutsideAreaPage() {
  const row = await requireTenantCase();
  const address = normalizedAddressOf(row);
  const jurisdiction = row.jurisdiction ?? "Outside Baltimore City";

  return (
    <FlowLayout
      title="Verify license"
      backHref="/scan/review"
      step={2}
      className="gap-3.5 p-5 md:gap-5 md:px-0"
      mobileFooter={
        <div className="flex gap-2.5">
          <Link href="/scan/review" className={buttonClassName("secondary", "lg", "min-w-0 flex-1 px-4.5 text-14")}>
            <Icon icon={Pencil} size={18} />
            Edit address
          </Link>
          <form action={startOver} className="flex min-w-0 flex-1">
            <SubmitButton className={buttonClassName("primary", "lg", "w-full px-4.5 text-14")}>Start over</SubmitButton>
          </form>
        </div>
      }
    >
      <PageHeading title="This check covers Baltimore City only">
        The address on your summons is outside Baltimore City limits, so the rental license rule Standing
        checks doesn’t apply to it.
      </PageHeading>

      <section
        aria-labelledby="summons-address"
        className="flex flex-col gap-2 rounded-[10px] border border-warning-border bg-bg-surface p-4"
      >
        <div className="flex items-center gap-2">
          <Icon icon={MapPin} size={16} className="text-text-tertiary" />
          <h2
            id="summons-address"
            className="min-w-0 flex-1 text-12 leading-[1.45] font-medium text-text-secondary"
          >
            Address on your summons
          </h2>
          <Badge tone="warn">{jurisdiction}</Badge>
        </div>
        <p className="font-mono text-13 leading-[1.45]">{address}</p>
        <Link
          href="/scan/review"
          className="flex items-center gap-1.5 self-start rounded-md text-13 leading-[1.45] font-semibold text-accent hover:underline"
        >
          <Icon icon={Pencil} size={14} />
          Address wrong? Edit it
        </Link>
      </section>

      <section
        aria-labelledby="help-instead"
        className="flex flex-col overflow-hidden rounded-[10px] border border-border-default bg-bg-surface"
      >
        <div className="flex flex-col gap-0.5 border-b border-border-default px-4 py-3 leading-[1.45]">
          <h2 id="help-instead" className="text-14 font-semibold">
            Where to get help instead
          </h2>
          <p className="text-12 text-text-tertiary">
            Other Maryland counties have different rules. A lawyer can tell you which defenses apply.
          </p>
        </div>
        <ul>
          {outsideAreaResources.map(({ name, detail, action, href }) => (
            <li
              key={name}
              className="flex items-center gap-3 border-b border-border-default px-4 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.45]">
                <p className="text-14 font-medium">{name}</p>
                <p className="text-12 text-text-tertiary">{detail}</p>
              </div>
              <a
                href={href}
                {...(action === "open" ? { target: "_blank", rel: "noreferrer" } : {})}
                aria-label={`${action === "call" ? "Call" : "Open"} ${name}`}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-13 leading-none font-medium hover:bg-bg-subtle"
              >
                <Icon icon={action === "call" ? Phone : ExternalLink} size={14} />
                {action === "call" ? "Call" : "Open"}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="hidden justify-end gap-3 md:flex">
        <Link href="/scan/review" className={buttonClassName("secondary", "md", "h-11.5")}>
          <Icon icon={Pencil} size={18} />
          Edit address
        </Link>
        <form action={startOver}>
          <SubmitButton className={buttonClassName("primary", "md", "h-11.5")}>Start over</SubmitButton>
        </form>
      </div>
    </FlowLayout>
  );
}
