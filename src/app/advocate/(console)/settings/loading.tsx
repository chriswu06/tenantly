import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { SettingsFormSkeleton, SettingsPageHeader } from "@/components/advocate/SettingsForm";

/** Settings while they load: real panels and labels; placeholder field values and switches. */
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
