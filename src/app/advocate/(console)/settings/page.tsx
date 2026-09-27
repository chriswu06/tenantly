import type { Metadata } from "next";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { SettingsForm, SettingsPageHeader } from "@/components/advocate/SettingsForm";
import { requireAdvocate } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const advocate = await requireAdvocate();
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Settings" }]} title="Settings" />
      <PageBody>
        <SettingsPageHeader />
        <SettingsForm
          settings={{
            fullName: advocate.fullName,
            email: advocate.email,
            role: advocate.role,
            notify: advocate.notify,
            organization: {
              name: advocate.organization.name,
              callbackPhone: advocate.organization.callbackPhone,
              languages: advocate.organization.languages,
            },
          }}
        />
      </PageBody>
    </>
  );
}
