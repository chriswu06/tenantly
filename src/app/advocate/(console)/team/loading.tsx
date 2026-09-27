import { ConsoleHeader } from "@/components/advocate/ConsoleHeader";
import { LoadingPageBody } from "@/components/advocate/ConsolePage";
import { InviteMemberDialog } from "@/components/advocate/InviteMemberDialog";
import { TeamNote, TeamPageHeader, TeamTableSkeleton } from "@/components/advocate/TeamTable";

/** Team while it loads: real header, invite button and note; placeholder members. */
export default function TeamLoading() {
  return (
    <>
      <ConsoleHeader breadcrumbs={[{ label: "Team" }]} title="Team" />
      <LoadingPageBody label="Loading team">
        <TeamPageHeader />
        <div className="lg:hidden">
          <InviteMemberDialog trigger="mobile" />
        </div>
        <TeamTableSkeleton />
        <TeamNote />
      </LoadingPageBody>
    </>
  );
}
