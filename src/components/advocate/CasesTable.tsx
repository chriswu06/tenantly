import Link from "next/link";
import { Calendar, Download, Ellipsis, Funnel, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Table, TableCard, TableHead, TablePagination, TableToolbar, Td, Th, Tr } from "@/components/ui/Table";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { formatDate, licenseResultBadge, shortAddress, type AdvocateCase } from "@/lib/mock/advocate";
import { buttonClassName } from "@/components/ui/Button";

export function caseHref(c: AdvocateCase) {
  return `/advocate/cases/${c.reference}`;
}

type CasesTableProps = {
  cases: AdvocateCase[];
  filterTabs: TabItem[];
  total: number;
};

/** Desktop cases table with filter toolbar and pagination (frame 11). Hidden below `lg`. */
export function CasesTable({ cases, filterTabs, total }: CasesTableProps) {
  return (
    <TableCard className="hidden lg:block">
      <TableToolbar>
        <Tabs items={filterTabs} label="Case filters" className="min-w-0 flex-1" />
        <button type="button" className={buttonClassName("secondary", "xs")}>
          <Icon icon={Funnel} size={14} />
          Filter
        </button>
        <button type="button" className={buttonClassName("secondary", "xs")}>
          <Icon icon={Download} size={14} />
          Export
        </button>
      </TableToolbar>
      <Table className="min-w-[1000px]">
        <TableHead>
          <tr>
            <Th className="w-[130px]">Reference</Th>
            <Th>Property</Th>
            <Th className="w-[200px]">Landlord</Th>
            <Th className="w-[100px]">Filed</Th>
            <Th className="w-[100px]">Hearing</Th>
            <Th className="w-[180px]">License status</Th>
            <Th className="w-[110px]">Assignee</Th>
            <Th className="relative w-[56px]">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </TableHead>
        <tbody>
          {cases.map((c) => {
            const badge = licenseResultBadge[c.licenseResult];
            return (
              <Tr key={c.reference} className="relative last:border-b-0">
                <Td className="font-mono text-12 text-accent">{c.reference}</Td>
                <Td className="font-medium text-text-primary">
                  {/* Stretched link: the whole row opens the case. */}
                  <Link href={caseHref(c)} className="after:absolute after:inset-0 after:content-['']">
                    {shortAddress(c.propertyAddress)}
                  </Link>
                </Td>
                <Td>{c.landlordName}</Td>
                <Td>{formatDate(c.filingDate, "short")}</Td>
                <Td>{formatDate(c.hearingDate, "short")}</Td>
                <Td>
                  <Badge tone={badge.tone} dot>
                    {badge.label}
                  </Badge>
                </Td>
                <Td>{c.assignee ?? "Unassigned"}</Td>
                <Td>
                  <button
                    type="button"
                    aria-label={`More actions for ${c.reference}`}
                    className="relative z-10 flex size-7 items-center justify-center rounded-md text-text-secondary hover:bg-bg-subtle"
                  >
                    <Icon icon={Ellipsis} size={16} />
                  </button>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
      <div className="border-t border-border-default">
        <TablePagination from={1} to={cases.length} total={total} nextHref="?page=2" />
      </div>
    </TableCard>
  );
}

/** Mobile case cards (frame 11m). Hidden from `lg` up. */
export function CaseCards({ cases }: { cases: AdvocateCase[] }) {
  return (
    <ul className="flex flex-col gap-3.5 lg:hidden">
      {cases.map((c) => {
        const badge = licenseResultBadge[c.licenseResult];
        return (
          <li key={c.reference}>
            <Link
              href={caseHref(c)}
              className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-surface p-3.5 hover:border-border-strong"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono text-12 leading-[1.4] text-accent">{c.reference}</span>
                <Badge tone={badge.tone} dot>
                  {badge.label}
                </Badge>
              </span>
              <span className="text-15 leading-[1.4] font-semibold text-text-primary">
                {shortAddress(c.propertyAddress)}
              </span>
              <span className="text-13 leading-[1.4] text-text-secondary">{c.landlordName}</span>
              <span className="flex items-center gap-3 pt-1 text-12 leading-[1.4] text-text-tertiary">
                <span className="flex items-center gap-1">
                  <Icon icon={Calendar} size={14} />
                  Hearing {formatDate(c.hearingDate, "month")}
                </span>
                <span>· {c.assignee ?? "Unassigned"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Mobile search field with a filter button (frame 11m). Hidden from `lg` up, where the top bar has search. */
export function CaseSearch() {
  return (
    <div className="flex h-10.5 items-center gap-2 rounded-lg border border-border-strong bg-bg-surface pr-1.5 pl-3 focus-within:border-accent lg:hidden">
      <Icon icon={Search} size={16} className="text-text-tertiary" />
      <label className="min-w-0 flex-1">
        <span className="sr-only">Search cases</span>
        <input
          type="search"
          placeholder="Search address, case #, landlord"
          className="w-full bg-transparent text-14 leading-none text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </label>
      <button
        type="button"
        aria-label="Filter cases"
        className="flex size-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={Funnel} size={16} />
      </button>
    </div>
  );
}
