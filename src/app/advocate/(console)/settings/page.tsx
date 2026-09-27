import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { SettingsForm, SettingsPageHeader } from "@/components/advocate/SettingsForm";

/** Advocate settings (Figma frames 64 desktop, 65 mobile). */
export default function SettingsPage() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Settings" }]} title="Settings" />
      <PageBody>
        <SettingsPageHeader />
        <SettingsForm />
      </PageBody>
    </>
  );
}
