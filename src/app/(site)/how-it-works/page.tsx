import type { Metadata } from "next";
import Link from "next/link";
import { Ban, Calendar, FileText } from "lucide-react";
import { InfoPage, Panel, PanelItem } from "@/components/site/InfoPage";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <InfoPage
      appBarTitle="How it works"
      title="How Standing works"
      lead="A free tool for Baltimore City tenants with a failure-to-pay-rent case. It takes about 2 minutes and doesn’t need an account."
    >
      <Panel title="Four steps">
        <PanelItem step={1} title="Upload or scan your summons">
          We read the property address, case number, landlord and court date. The image is deleted as soon as it’s
          read.
        </PanelItem>
        <PanelItem step={2} title="Review what we read">
          You confirm or correct each detail before anything is checked.
        </PanelItem>
        <PanelItem step={3} title="We check city records">
          We look up Baltimore City DHCD rental license records for the property and compare them to the date your
          case was filed.
        </PanelItem>
        <PanelItem step={4} title="Get your next steps">
          Your result, how to request the official DHCD certification, a court-day checklist and where to find free
          legal help.
        </PanelItem>
      </Panel>

      <Panel title="What Standing is not">
        <PanelItem icon={Ban} title="Not a lawyer or legal advice">
          Standing gives information. A lawyer can tell you what it means for your case.
        </PanelItem>
        <PanelItem icon={FileText} title="Not official proof">
          Only a DHCD certification is accepted as evidence in court.
        </PanelItem>
        <PanelItem icon={Calendar} title="Not a reason to skip court">
          Always go to your hearing, whatever your result.
        </PanelItem>
      </Panel>

      <Link
        href="/"
        className="flex h-12 items-center justify-center rounded-lg bg-accent px-4.5 text-14 leading-none font-semibold text-text-inverse hover:bg-accent/90 md:h-[46px] md:self-start"
      >
        Check my landlord
      </Link>
    </InfoPage>
  );
}
