import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Table, TableCard, TableHead, Td, Th, Tr } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { licenseResultBadge, type Lookup } from "@/lib/mock/advocate";

/** License lookup log: table on desktop (frame 58), cards on mobile (frame 59). */
export function LookupsTable({ lookups }: { lookups: Lookup[] }) {
  if (lookups.length === 0) {
    return (
      <p className="rounded-[10px] border border-border-default bg-bg-surface p-4 text-13 text-text-secondary">
        No lookups match this filter.
      </p>
    );
  }

  return (
    <>
      <TableCard className="hidden rounded-[10px] lg:block">
        <Table className="min-w-[720px]">
          <TableHead>
            <tr>
              <Th className="w-[130px]">Time</Th>
              <Th>Address</Th>
              <Th className="w-[180px]">Result</Th>
              <Th className="w-[110px]">Response</Th>
              <Th className="w-[150px]">Case</Th>
            </tr>
          </TableHead>
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
