import { Ellipsis, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableCard, TableHead, Td, Th, Tr } from "@/components/ui/Table";
import type { TeamMember } from "@/lib/mock/advocate";
import { currentAdvocate } from "./console-config";
import { Avatar, BadgeSkeleton, LineSkeleton, PageHeader } from "./ConsolePage";
import { InviteMemberDialog } from "./InviteMemberDialog";

const COLUMN_COUNT = 6;

/** Desktop page title with the invite button (frame 62). */
export function TeamPageHeader() {
  return (
    <PageHeader
      title="Team"
      description={`People at ${currentAdvocate.organization} who can see shared cases.`}
      actions={<InviteMemberDialog trigger="desktop" />}
    />
  );
}

/** Note under the team list (frames 62, 63). */
export function TeamNote() {
  return (
    <p className="text-12 leading-[1.4] text-text-tertiary">
      Only admins can invite or remove members. Invitations expire after 7 days.
    </p>
  );
}

function TeamTableHead() {
  return (
    <TableHead>
      <tr>
        <Th>Member</Th>
        <Th className="w-[190px]">Role</Th>
        <Th className="w-[110px]">Access</Th>
        <Th className="w-[110px]">Open cases</Th>
        <Th className="w-[110px]">Status</Th>
        <Th className="relative w-[56px]">
          <span className="sr-only">Actions</span>
        </Th>
      </tr>
    </TableHead>
  );
}

/** Shown under the list when nobody besides you has joined or been invited. */
function TeamEmptyState() {
  return (
    <EmptyState
      icon={UserPlus}
      title="No teammates yet"
      description={`Invite colleagues at ${currentAdvocate.organization} so they can see and work on shared cases.`}
      action={<InviteMemberDialog trigger="empty" />}
    />
  );
}

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  return status === "active" ? <Badge tone="ok">Active</Badge> : <Badge tone="warn">Invited</Badge>;
}

/**
 * Team members: table on desktop (frame 62), list on mobile (frame 63).
 * With nobody but you on the team (0 or 1 members), an invite prompt follows the rows.
 */
export function TeamTable({ members }: { members: TeamMember[] }) {
  const alone = members.length <= 1;
  return (
    <>
      <TableCard className="hidden rounded-[10px] lg:block">
        <Table className="min-w-[720px]">
          <TeamTableHead />
          <tbody>
            {members.map((m) => (
              <Tr key={m.email} className="last:border-b-0">
                <Td className="h-14.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={m.initials} />
                    {m.name ? (
                      <div className="flex min-w-0 flex-col gap-px leading-[1.4]">
                        <span className="text-14 font-medium text-text-primary">{m.name}</span>
                        <span className="truncate text-12 text-text-tertiary">{m.email}</span>
                      </div>
                    ) : (
                      <span className="truncate text-12 leading-[1.4] font-medium text-text-primary">{m.email}</span>
                    )}
                  </div>
                </Td>
                <Td>{m.role}</Td>
                <Td>{m.access === "Admin" ? <Badge tone="accent">Admin</Badge> : m.access}</Td>
                <Td>{m.openCases ?? "—"}</Td>
                <Td>
                  <StatusBadge status={m.status} />
                </Td>
                <Td>
                  <button
                    type="button"
                    aria-label={`More actions for ${m.name ?? m.email}`}
                    className="flex size-7 items-center justify-center rounded-md text-text-secondary hover:bg-bg-subtle"
                  >
                    <Icon icon={Ellipsis} size={16} />
                  </button>
                </Td>
              </Tr>
            ))}
            {alone && (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  <TeamEmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableCard>

      <ul className="overflow-hidden rounded-[10px] border border-border-default bg-bg-surface lg:hidden">
        {members.map((m) => (
          <li
            key={m.email}
            className="flex items-center gap-3 border-b border-border-default px-3.5 py-3 last:border-b-0"
          >
            <Avatar initials={m.initials} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4]">
              <span className="truncate text-14 font-medium text-text-primary">{m.name ?? m.email}</span>
              <span className="text-12 text-text-tertiary">
                {m.role}
                {m.openCases !== null && ` · ${m.openCases} open cases`}
              </span>
            </div>
            {m.status === "invited" ? (
              <StatusBadge status={m.status} />
            ) : (
              m.access === "Admin" && <Badge tone="accent">Admin</Badge>
            )}
          </li>
        ))}
        {alone && (
          <li>
            <TeamEmptyState />
          </li>
        )}
      </ul>
    </>
  );
}

/** Loading team list: the real table header, then placeholder rows (desktop) or list items (mobile). */
export function TeamTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <>
      <TableCard className="hidden rounded-[10px] lg:block">
        <Table className="min-w-[720px]">
          <TeamTableHead />
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <Tr key={i} className="last:border-b-0 hover:bg-transparent">
                <Td className="h-14.5">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="flex min-w-0 flex-1 flex-col gap-px leading-[1.4]">
                      <LineSkeleton className="text-14" barClassName="w-28" />
                      <LineSkeleton className="text-12" barClassName="w-44" />
                    </div>
                  </div>
                </Td>
                <Td>
                  <LineSkeleton barClassName="w-28" />
                </Td>
                <Td>
                  <LineSkeleton className="w-14" />
                </Td>
                <Td>
                  <LineSkeleton className="w-5" />
                </Td>
                <Td>
                  <BadgeSkeleton className="w-14" />
                </Td>
                <Td />
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      <ul className="overflow-hidden rounded-[10px] border border-border-default bg-bg-surface lg:hidden">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-3 border-b border-border-default px-3.5 py-3 last:border-b-0">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.4]">
              <LineSkeleton className="text-14" barClassName="w-28" />
              <LineSkeleton className="text-12" barClassName="w-44" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
