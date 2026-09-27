import type { Metadata } from "next";
import { Ban, Camera, FileText, Lock, Trash2, Users } from "lucide-react";
import { ContactCard, InfoPage, Panel, PanelItem } from "@/components/site/InfoPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <InfoPage
      appBarTitle="Privacy"
      title="Privacy"
      lead="Standing is built to collect as little as possible. No account, no tracking ads."
    >
      <Panel title="What we handle">
        <PanelItem icon={Camera} title="Your summons photo">
          Read by our system, then deleted right away. It is never stored.
        </PanelItem>
        <PanelItem icon={FileText} title="The details you confirm">
          Kept only for this visit, unless you choose to share your case with legal aid.
        </PanelItem>
        <PanelItem icon={Lock} title="Anonymous outcome reports">
          No name, address or case number is attached.
        </PanelItem>
      </Panel>

      <Panel title="If you share your case with legal aid">
        <PanelItem icon={Users} title="Only the organization you choose">
          Other organizations and the public can’t see it.
        </PanelItem>
        <PanelItem icon={Trash2} title="You can withdraw at any time">
          Your case and contact details are then deleted.
        </PanelItem>
      </Panel>

      <Panel title="What we never do">
        <PanelItem icon={Ban} title="Sell or rent your information" />
        <PanelItem icon={Ban} title="Share anything with your landlord" />
        <PanelItem icon={Ban} title="Use advertising trackers" />
      </Panel>

      <ContactCard title="Questions about your data?">Email us and we’ll reply within 2 business days.</ContactCard>
    </InfoPage>
  );
}
