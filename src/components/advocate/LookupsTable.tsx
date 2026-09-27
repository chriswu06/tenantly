import Link from "next/link";
import { CircleCheck, Database, Download, Funnel } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Table, TableCard, TableHead, Td, Th, Tr } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { licenseResultBadge, type Lookup } from "@/lib/mock/advocate";
import { BadgeSkeleton, LineSkeleton, PageHeader } from "./ConsolePage";

const LOOKUPS_HREF = "/advocate/lookups";

/** "Failed only" toggle and "Export CSV" (page header on desktop, own row on mobile). */
export function LookupsActions({ failedOnly = false }: { failedOnly?: boolean }) {
  return (
    <>
      <Link
        href={failedOnly ? LOOKUPS_HREF : `${LOOKUPS_HREF}?filter=failed`}
        aria-current={failedOnly ? "page" : undefined}
        className={buttonClassName("secondary", "sm", cn(failedOnly && "border-text-primary bg-bg-subtle"))}
      >
        <Icon icon={Funnel} size={16} />
        Failed only
      </Link>
      <button type="button" className={buttonClassName("secondary", "sm")}>
        <Icon icon={Download} size={16} />
        Export CSV
      </button>
    </>
  );
}

/** Desktop page title with the actions (frame 58). */
export function LookupsPageHeader({ failedOnly = false }: { failedOnly?: boolean }) {
  return (
    <PageHeader
      title="License lookups"
      description="Every DHCD license check run for your organization’s cases."
      actions={<LookupsActions failedOnly={failedOnly} />}
    />
  );
}

function LookupsTableHead() {
  return (
    <TableHead>
      <tr>
        <Th className="w-[130px]">Time</Th>
        <Th>Address</Th>
        <Th className="w-[180px]">Result</Th>
        <Th className="w-[110px]">Response</Th>
        <Th className="w-[150px]">Case</Th>
      </tr>
    </TableHead>
  );
}

/** Shown in place of the rows or cards when there are no lookups to show. */
function LookupsEmptyState({ failedOnly }: { failedOnly: boolean }) {
  return failedOnly ? (
    <EmptyState
      icon={CircleCheck}
      title="No failed lookups"
      description="Every license check got a response from DHCD."
      action={
        <Link href={LOOKUPS_HREF} className={buttonClassName("secondary", "sm")}>
          Show all lookups
        </Link>
      }
    />
  ) : (
    <EmptyState
      icon={Database}
      title="No lookups yet"
      description="Each DHCD license check run for your organization’s cases will be logged here."
    />
  );
}

type LookupsTableProps = {
  lookups: Lookup[];
  /** The list is filtered to failed lookups (`?filter=failed`). */
  failedOnly?: boolean;
};

/** License lookup log: table on desktop (frame 58), cards on mobile (frame 59). */
export function LookupsTable({ lookups, failedOnly = false }: LookupsTableProps) {
  if (lookups.length === 0) {
    return (
      <>
        <TableCard className="hidden rounded-[10px] lg:block">
          <Table className="min-w-[720px]">
            <LookupsTableHead />
            <tbody>
              <tr>
                <td colSpan={5}>
                  <LookupsEmptyState failedOnly={failedOnly} />
                </td>
              </tr>
            </tbody>
          </Table>
        </TableCard>
        <div className="rounded-lg border border-border-default bg-bg-surface lg:hidden">
          <LookupsEmptyState failedOnly={failedOnly} />
        </div>
      </>
    );
  }

  return (
    <>
      <TableCard className="hidden rounded-[10px] lg:block">
        <Table className="min-w-[720px]">
          <LookupsTableHead />
          <tbody>
            {lookups.map((l) => {
              const badge = licenseResultBadge[l.result];
              return (
                <Tr key={`${l.reference}-${l.time}`} className="last:border-b-0">
                  <Td className="h-11.5 font-mono">{l.time}</Td>
                  <Td className="font-medium text-text-primary">{l.address}</Td>
                  <Td>
                    <Badge tone={badge.tone} dot>
                      {badge.label}
                    </Badge>
                  </Td>
                  <Td className={cn(!l.response && "text-danger-fg")}>{l.response ?? "Timed out"}</Td>
                  <Td className="font-mono">
                    <Link href={`/advocate/cases/${l.reference}`} className="text-accent hover:underline">
                      {l.reference}
                    </Link>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableCard>

      <ul className="flex flex-col gap-3.5 lg:hidden">
        {lookups.map((l) => {
          const badge = licenseResultBadge[l.result];
          return (
            <li key={`${l.reference}-${l.time}`}>
              <Link
                href={`/advocate/cases/${l.reference}`}
                className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-surface p-3.5 hover:border-border-strong"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-12 leading-[1.4] text-text-secondary">{l.time}</span>
                  <Badge tone={badge.tone} dot>
                    {badge.label}
                  </Badge>
                </span>
                <span className="text-14 leading-[1.4] font-semibold text-text-primary">{l.address}</span>
                <span className="flex gap-2 text-12 leading-[1.4] whitespace-nowrap">
                  <span className="font-mono text-accent">{l.reference}</span>
                  <span className={l.response ? "text-text-tertiary" : "text-danger-fg"}>
                    · {l.response ?? "Timed out"}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Loading lookup log: the real table header, then placeholder rows (desktop) or cards (mobile). */
export function LookupsTableSkeleton({ rows = 8, cards = 5 }: { rows?: number; cards?: number }) {
  return (
    <>
      <TableCard className="hidden rounded-[10px] lg:block">
        <Table className="min-w-[720px]">
          <LookupsTableHead />
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <Tr key={i} className="last:border-b-0 hover:bg-transparent">
                <Td className="h-11.5">
                  <LineSkeleton className="w-22" />
                </Td>
                <Td>
                  <LineSkeleton barClassName={i % 2 ? "w-40" : "w-52"} />
                </Td>
                <Td>
                  <BadgeSkeleton className="w-32" />
                </Td>
                <Td>
                  <LineSkeleton className="w-9" />
                </Td>
                <Td>
                  <LineSkeleton className="w-26" />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      <ul className="flex flex-col gap-3.5 lg:hidden">
        {Array.from({ length: cards }, (_, i) => (
          <li key={i} className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-surface p-3.5">
            <div className="flex items-center justify-between gap-2">
              <LineSkeleton className="w-22 text-12 leading-[1.4]" />
              <BadgeSkeleton className="w-28" />
            </div>
            <LineSkeleton className="text-14 leading-[1.4]" barClassName={i % 2 ? "w-40" : "w-48"} />
            <LineSkeleton className="text-12 leading-[1.4]" barClassName="w-36" />
          </li>
        ))}
      </ul>
    </>
  );
}
