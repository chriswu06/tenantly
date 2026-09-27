import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { SettingsFormSkeleton, SettingsPageHeader } from "@/components/advocate/SettingsForm";

export default function SettingsLoading() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Settings" }]} title="Settings" />
      <LoadingPageBody label="Loading settings">
        <SettingsPageHeader />
        <SettingsFormSkeleton />
      </LoadingPageBody>
    </>
  );
}
