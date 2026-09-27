import type { ReactNode } from "react";
import { Mail, type LucideIcon } from "lucide-react";
import { AppBar } from "@/components/layout/AppBar";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/*
 * Building blocks for the public info pages (Figma 39–46):
 * How it works, About the license law, Privacy, Accessibility.
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

const contactEmail = "hello@standing.example";

/** Blue "Questions? Email us" card at the end of Privacy and Accessibility. */
export function ContactCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col items-start gap-1.5 rounded-[10px] border border-accent-border bg-accent-subtle p-4">
      <h2 className="text-15 leading-[1.45] font-semibold">{title}</h2>
      <p className="text-13 leading-[1.45] text-text-secondary">{children}</p>
      <a
        href={`mailto:${contactEmail}`}
        className="flex items-center gap-2 rounded-md text-13 leading-[1.45] font-semibold text-accent hover:underline"
      >
        <Icon icon={Mail} size={16} />
        {contactEmail}
      </a>
    </section>
  );
}
