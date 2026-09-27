import type { Metadata } from "next";
import { Eye, Globe, Keyboard, Type, Volume2 } from "lucide-react";
import { ContactCard, InfoPage, Panel, PanelItem } from "@/components/site/InfoPage";

export const metadata: Metadata = { title: "Accessibility" };

// Figma 46 · Accessibility — mobile, 45 · Web — Accessibility.
export default function AccessibilityPage() {
  return (
    <InfoPage
      appBarTitle="Accessibility"
      title="Accessibility"
      lead="Standing should work for every tenant, on any device."
    >
      <Panel title="How Standing is built">
        <PanelItem icon={Volume2} title="Read-aloud on every page">
          Tap Listen to hear any page read out loud.
        </PanelItem>
        <PanelItem icon={Globe} title="English and Spanish">
          Switch language at any time from the top of the page.
        </PanelItem>
        <PanelItem icon={Type} title="Plain language and large text">
          Written for a 6th-grade reading level. Text resizes with your device settings.
        </PanelItem>
        <PanelItem icon={Eye} title="High contrast">
          Colors meet WCAG 2.2 AA contrast. Status is never shown by color alone.
        </PanelItem>
        <PanelItem icon={Keyboard} title="Screen readers and keyboards">
          Every step works with a screen reader or without a mouse.
        </PanelItem>
      </Panel>

      <ContactCard title="Something not working for you?">
        Tell us what happened and what device you use. We’ll fix it or help you another way.
      </ContactCard>
    </InfoPage>
  );
}
