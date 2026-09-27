import { Button } from "@/components/ui/Button";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody, PageHeader } from "@/components/advocate/ConsolePage";
import { SETTINGS_FORM_ID, SettingsForm } from "@/components/advocate/SettingsForm";

/** Advocate settings (Figma frames 64 desktop, 65 mobile). */
export default function SettingsPage() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Settings" }]} title="Settings" />
      <PageBody>
        <PageHeader
          title="Settings"
          description="Your profile, notifications and security."
          actions={
            <Button type="submit" form={SETTINGS_FORM_ID} size="sm">
              Save changes
            </Button>
          }
        />
        <SettingsForm />
      </PageBody>
    </>
  );
}
