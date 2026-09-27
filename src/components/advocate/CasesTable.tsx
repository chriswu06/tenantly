import Link from "next/link";
import { Calendar, ChevronDown, Download, Ellipsis, FolderOpen, Funnel, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableCard, TableHead, TablePagination, TableToolbar, Td, Th, Tr } from "@/components/ui/Table";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { caseFilterDefs, type AdvocateCase, type CaseFilter } from "@/lib/cases/queries";
import { buttonClassName } from "@/components/ui/Button";
import { BadgeSkeleton, LineSkeleton, PageHeader } from "./ConsolePage";
import { formatDate, hrefWith, licenseResultBadge, shortAddress } from "./display";

export { CaseSearch } from "./CaseSearch";

const CASES_HREF = "/advocate/cases";

export function caseHref(c: AdvocateCase) {
  return `/advocate/cases/${c.reference}`;
}

/**
 * Filter tabs for the cases list. Each keeps the current search (`q`).
 * While loading, pass nothing: the tabs show their labels only, since the counts are data
 * and the loading state can't read the URL.
 */
export function caseFilterTabs(active?: CaseFilter, counts?: Record<CaseFilter, number>, q?: string): TabItem[] {
  return caseFilterDefs.map((f) => ({
    href: hrefWith(CASES_HREF, { filter: f.key === "all" ? undefined : f.key, q }),
    label: f.label,
    shortLabel: f.shortLabel,
    count: counts?.[f.key],
    active: f.key === active,
  }));
}

/** Desktop page title with the date range button. */
export function CasesPageHeader() {
  return (
    <PageHeader
      title="Cases"
      description="Tenants checked through Tenantly and referred to your organization."
      actions={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-13 leading-[1.4] font-medium text-text-primary hover:bg-bg-subtle"
        >
          Last 30 days
          <Icon icon={ChevronDown} size={16} />
        </button>
      }
    />
  );
}

type CasesEmptyProps = {
  /** True when a filter or search is applied, so the list is empty only because of it. */
  filtered?: boolean;
  /** The search, if any, so the message can say what didn't match. */
  query?: string;
};

/** Shown in place of the cases table rows or cards when there are none to show. */
export function CasesEmptyState({ filtered = false, query }: CasesEmptyProps) {
  return filtered ? (
    <EmptyState
      icon={SearchX}
      title={query ? `No cases match “${query}”` : "No cases match this filter"}
      description={
        query
          ? "Check the spelling, or search by reference, street address, case number or landlord."
          : "Try another filter, or clear it to see all cases."
      }
      action={
        <Link href={CASES_HREF} className={buttonClassName("secondary", "sm")}>
          {query ? "Clear search" : "Clear filter"}
        </Link>
      }
    />
  ) : (
    <EmptyState
      icon={FolderOpen}
      title="No cases yet"
      description="Cases appear here when a tenant checks their landlord’s license with Tenantly and shares the case with your organization."
    />
  );
}

const COLUMN_COUNT = 8;

function CasesToolbar({ filterTabs }: { filterTabs: TabItem[] }) {
  return (
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
  );
}

function CasesTableHead() {
  return (
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
  );
}

export type CasesPagination = { from: number; to: number; total: number; prevHref?: string; nextHref?: string };

type CasesTableProps = CasesEmptyProps & {
  cases: AdvocateCase[];
  filterTabs: TabItem[];
  pagination: CasesPagination;
};

/** Desktop cases table with filter toolbar and pagination. Hidden below `lg`. */
export function CasesTable({ cases, filterTabs, pagination, filtered, query }: CasesTableProps) {
  return (
    <TableCard className="hidden lg:block">
      <CasesToolbar filterTabs={filterTabs} />
      <Table className="min-w-[1000px]">
        <CasesTableHead />
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan={COLUMN_COUNT}>
                <CasesEmptyState filtered={filtered} query={query} />
              </td>
            </tr>
          )}
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
      {cases.length > 0 && (
        <div className="border-t border-border-default">
          <TablePagination {...pagination} />
        </div>
      )}
    </TableCard>
  );
}

/** Mobile case cards with pagination under them. Hidden from `lg` up. */
export function CaseCards({
  cases,
  filtered,
  query,
  pagination,
}: CasesEmptyProps & { cases: AdvocateCase[]; pagination: CasesPagination }) {
  if (cases.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface lg:hidden">
        <CasesEmptyState filtered={filtered} query={query} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 lg:hidden">
    <ul className="flex flex-col gap-3.5">
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
                  {c.hearingDate ? `Hearing ${formatDate(c.hearingDate, "month")}` : "No hearing date"}
                </span>
                <span>· {c.assignee ?? "Unassigned"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
      <div className="rounded-lg border border-border-default bg-bg-surface">
        <TablePagination {...pagination} />
      </div>
    </div>
  );
}

/** Loading desktop table: the real toolbar and header, then placeholder rows. */
export function CasesTableSkeleton({ filterTabs, rows = 8 }: { filterTabs: TabItem[]; rows?: number }) {
  return (
    <TableCard className="hidden lg:block">
      <CasesToolbar filterTabs={filterTabs} />
      <Table className="min-w-[1000px]">
        <CasesTableHead />
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <Tr key={i} className="last:border-b-0 hover:bg-transparent">
              <Td>
                <LineSkeleton className="w-24" />
              </Td>
              <Td>
                <LineSkeleton barClassName={i % 2 ? "w-40" : "w-52"} />
              </Td>
              <Td>
                <LineSkeleton barClassName={i % 3 ? "w-36" : "w-28"} />
              </Td>
              <Td>
                <LineSkeleton className="w-16" />
              </Td>
              <Td>
                <LineSkeleton className="w-16" />
              </Td>
              <Td>
                <BadgeSkeleton className="w-32" />
              </Td>
              <Td>
                <LineSkeleton className="w-16" />
              </Td>
              <Td />
            </Tr>
          ))}
        </tbody>
      </Table>
      <div className="flex h-12 items-center justify-between border-t border-border-default px-4">
        <LineSkeleton className="w-28 text-13 leading-[1.4]" />
        <div className="flex gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
    </TableCard>
  );
}

/** Loading mobile case cards, sized like the real ones. */
export function CaseCardsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-3.5 lg:hidden">
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-surface p-3.5"
        >
          <div className="flex items-center justify-between gap-2">
            <LineSkeleton className="w-24 font-mono text-12 leading-[1.4]" />
            <BadgeSkeleton className="w-28" />
          </div>
          <LineSkeleton className="text-15 leading-[1.4]" barClassName={i % 2 ? "w-44" : "w-52"} />
          <LineSkeleton className="text-13 leading-[1.4]" barClassName="w-36" />
          <div className="pt-1">
            <LineSkeleton className="text-12 leading-[1.4]" barClassName="w-40" />
          </div>
        </li>
      ))}
    </ul>
  );
}
