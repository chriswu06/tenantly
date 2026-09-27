import { Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Table, TableCard, TableHead, Td, Th, Tr } from "@/components/ui/Table";
import type { TeamMember } from "@/lib/mock/advocate";
import { Avatar } from "./ConsolePage";

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  return status === "active" ? <Badge tone="ok">Active</Badge> : <Badge tone="warn">Invited</Badge>;
}

/** Team members: table on desktop (frame 62), list on mobile (frame 63). */
export function TeamTable({ members }: { members: TeamMember[] }) {
  return (
    <>
      <TableCard className="hidden rounded-[10px] lg:block">
        <Table className="min-w-[720px]">
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
      </ul>
    </>
  );
}
