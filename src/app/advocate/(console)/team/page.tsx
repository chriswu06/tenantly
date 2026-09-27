import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody, PageHeader } from "@/components/advocate/ConsolePage";
import { InviteMemberDialog } from "@/components/advocate/InviteMemberDialog";
import { TeamTable } from "@/components/advocate/TeamTable";
import { currentAdvocate } from "@/components/advocate/console-config";
import { teamMembers } from "@/lib/mock/advocate";

/** Team members and invitations (Figma frames 62 desktop, 63 mobile). */
export default function TeamPage() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Team" }]} title="Team" />
      <PageBody>
        <PageHeader
          title="Team"
          description={`People at ${currentAdvocate.organization} who can see shared cases.`}
          actions={<InviteMemberDialog trigger="desktop" />}
        />
        <div className="lg:hidden">
          <InviteMemberDialog trigger="mobile" />
        </div>
        <TeamTable members={teamMembers} />
        <p className="text-12 leading-[1.4] text-text-tertiary">
          Only admins can invite or remove members. Invitations expire after 7 days.
        </p>
      </PageBody>
    </>
  );
}
