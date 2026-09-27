import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, type LucideIcon } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { LanguageSelect } from "@/components/tenant/LanguageSelect";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
import { Icon } from "@/components/ui/Icon";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/*
 * Building blocks for the public info pages: How it works, About the license
 * law, Privacy, Accessibility.
 *
 * <InfoPage appBarTitle="Privacy" title="Privacy" lead="…">
 *   <Panel title="What we handle">
 *     <PanelItem icon={Camera} title="…">…</PanelItem>
 *   </Panel>
 * </InfoPage>
 */

type InfoPageProps = {
  /** Title in the mobile app bar, e.g. "How it works". */
  appBarTitle: string;
  title: string;
  lead: string;
  children: ReactNode;
};

/** Mobile app bar plus an 800px column on desktop. */
export function InfoPage({ appBarTitle, title, lead, children }: InfoPageProps) {
  return (
    <>
      <AppBar title={appBarTitle} backHref="/" className="shrink-0 md:hidden" />
      <main className="flex w-full flex-col gap-4 p-5 md:mx-auto md:max-w-[848px] md:gap-6 md:px-6 md:pt-14 md:pb-18">
        <div className="flex flex-col gap-2">
          <h1 className="text-24 font-semibold md:text-36 md:leading-[1.2] md:tracking-[-0.54px]">{title}</h1>
          <p className="text-15 leading-[1.5] text-text-secondary md:text-17 md:leading-[1.5] md:tracking-normal">
            {lead}
          </p>
        </div>
        {children}
      </main>
    </>
  );
}

/** White card with an optional header row and divided items. */
export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-border-default bg-bg-surface">
      {title && (
        <h2 className="border-b border-border-default px-4 pt-3.5 pb-3 text-15 leading-[1.45] font-semibold">
          {title}
        </h2>
      )}
      <ul className="divide-y divide-border-default">{children}</ul>
    </section>
  );
}

type PanelItemProps = {
  /** Icon in a grey tile. */
  icon?: LucideIcon;
  /** Step number in an accent circle, used instead of an icon. */
  step?: number;
  title: string;
  children?: ReactNode;
  /** External link; the whole row becomes the link. */
  href?: string;
};

export function PanelItem({ icon, step, title, children, href }: PanelItemProps) {
  const content = (
    <>
      {step !== undefined ? (
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-13 leading-none font-semibold text-accent"
        >
          {step}
        </span>
      ) : icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-text-secondary">
          <Icon icon={icon} size={18} />
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <h3 className="text-14 leading-[1.45] font-semibold">
          {step !== undefined && <span className="sr-only">Step {step}: </span>}
          {title}
        </h3>
        {children && <p className="text-13 leading-[1.55] text-text-secondary">{children}</p>}
      </div>
    </>
  );

  const rowClass = "flex items-start gap-3.5 px-4 py-3.5";

  return (
    <li>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn(rowClass, "hover:bg-bg-app")}>
          {content}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}

/** Grey note, e.g. "Last reviewed September 2026". */
export function NoteCard({ icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[10px] border border-border-default bg-bg-app p-3.5">
      <Icon icon={icon} size={18} className="text-text-secondary" />
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-14 leading-[1.45] font-semibold text-text-secondary">{title}</p>
        <p className="text-13 leading-[1.5]">{children}</p>
      </div>
    </div>
  );
}

// Shown address and the inbox the mailto link actually goes to.
const contactEmail = "tenantly-org@gmail.com";
const contactMailto = "chriswu.cwu06@gmail.com";

/** Blue "Questions? Email us" card at the end of Privacy and Accessibility. */
export function ContactCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col items-start gap-1.5 rounded-[10px] border border-accent-border bg-accent-subtle p-4">
      <h2 className="text-15 leading-[1.45] font-semibold">{title}</h2>
      <p className="text-13 leading-[1.45] text-text-secondary">{children}</p>
      <a
        href={`mailto:${contactMailto}`}
        className="flex items-center gap-2 rounded-md text-13 leading-[1.45] font-semibold text-accent hover:underline"
      >
        <Icon icon={Mail} size={16} />
        {contactEmail}
      </a>
    </section>
  );
}

/** Placeholder panel: header row and `items` icon rows, sized like <Panel> + <PanelItem>. */
function PanelSkeleton({ items }: { items: number }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border-default bg-bg-surface">
      <div className="border-b border-border-default px-4 pt-3.5 pb-3">
        <Skeleton className="my-[3px] h-4 w-40" />
      </div>
      <div className="divide-y divide-border-default">
        {Array.from({ length: items }, (_, i) => (
          <div key={i} className="flex items-start gap-3.5 px-4 py-3.5">
            <Skeleton className="size-8 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <Skeleton className="my-[3px] h-3.5 w-1/2" />
              <Skeleton className="my-1 h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading state for the info pages: the <InfoPage> layout with placeholder
 * title, intro and panels. The mobile bar mirrors <AppBar> with the title
 * replaced by a placeholder, since the page title isn't known yet.
 */
export function InfoPageSkeleton() {
  return (
    <>
      <header className="flex shrink-0 items-center gap-1 border-b border-border-default bg-bg-surface py-2 pr-3 pl-1 md:hidden print:hidden">
        <Link href="/" aria-label="Back" className={iconButtonClassName("ghost")}>
          <Icon icon={ChevronLeft} size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ReadAloudButton />
          <LanguageSelect />
        </div>
      </header>
      <LoadingRegion
        label="Loading page"
        className="flex w-full flex-col gap-4 p-5 md:mx-auto md:max-w-[848px] md:gap-6 md:px-6 md:pt-14 md:pb-18"
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="my-0.5 h-6 w-48 md:my-1 md:h-9 md:w-80" />
          {/* The intro wraps to two lines on mobile and fits on one in the 800px column. */}
          <div className="flex flex-col">
            <Skeleton className="my-[3.25px] h-4 md:my-[3.75px] md:h-[18px] md:w-3/4" />
            <Skeleton className="my-[3.25px] h-4 w-3/5 md:hidden" />
          </div>
        </div>
        <PanelSkeleton items={3} />
        <PanelSkeleton items={2} />
      </LoadingRegion>
    </>
  );
}
