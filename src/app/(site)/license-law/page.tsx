import type { Metadata } from "next";
import { Book, Clock, ExternalLink, FileText, Scale } from "lucide-react";
import { InfoPage, NoteCard, Panel, PanelItem } from "@/components/site/InfoPage";
import { dhcdRentalLicensingUrl, peoplesLawLibraryUrl } from "@/lib/contacts";

export const metadata: Metadata = { title: "About the license law" };

// Figma 42 · About the license law — mobile, 41 · Web — About the license law.
export default function LicenseLawPage() {
  return (
    <InfoPage
      appBarTitle="About the license law"
      title="The Baltimore City rental license rule"
      lead="Why your landlord’s rental license can matter in rent court."
    >
      <Panel>
        <PanelItem icon={Book} title="What the law says">
          Most Baltimore City rental properties must have an active rental license from the Department of Housing and
          Community Development (DHCD). Since 2019, a landlord without an active license cannot bring a
          failure-to-pay-rent case. Changes in October 2023 extended the rule to other eviction cases.
        </PanelItem>
        <PanelItem icon={FileText} title="What counts as proof">
          Courts rely on an official certification from DHCD’s Property Registration and Licensing Division.
          Standing’s result tells you whether it’s worth requesting one.
        </PanelItem>
        <PanelItem icon={Scale} title="What to do">
          Request the certification, bring it to your hearing, and ask the volunteer attorney at court to help you
          raise the defense.
        </PanelItem>
      </Panel>

      <Panel title="Learn more">
        <PanelItem icon={ExternalLink} title="Maryland People’s Law Library" href={peoplesLawLibraryUrl}>
          Baltimore City rental dwelling license law
        </PanelItem>
        <PanelItem icon={ExternalLink} title="Baltimore City DHCD" href={dhcdRentalLicensingUrl}>
          Rental property registration and licensing
        </PanelItem>
      </Panel>

      <NoteCard icon={Clock} title="Last reviewed September 2026">
        Laws and procedures change. Confirm how the rule applies to your case with a lawyer.
      </NoteCard>
    </InfoPage>
  );
}
