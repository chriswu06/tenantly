import type { Metadata } from "next";
import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { PageBody } from "@/components/advocate/ConsolePage";
import { InviteMemberDialog } from "@/components/advocate/InviteMemberDialog";
import { TeamNote, TeamPageHeader, TeamTable } from "@/components/advocate/TeamTable";
import { getTeam } from "@/lib/cases/queries";

export const metadata: Metadata = { title: "Team" };

/** Team members and invitations (Figma frames 62 desktop, 63 mobile). */
export default async function TeamPage() {
  const { team, canInvite } = await getTeam();
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Team" }]} title="Team" />
      <PageBody>
        <TeamPageHeader />
        {canInvite && (
          <div className="lg:hidden">
            <InviteMemberDialog trigger="mobile" />
          </div>
        )}
        <TeamTable members={team} canInvite={canInvite} />
        <TeamNote />
      </PageBody>
    </>
  );
}
