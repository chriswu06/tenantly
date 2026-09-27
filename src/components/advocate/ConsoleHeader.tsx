"use client";

import { Fragment, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ChevronLeft, Ellipsis, Plus, Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { NEW_CHECK_HREF } from "./console-config";
import { useConsoleSession } from "./ConsoleSession";
import { useCaseSearch } from "./useCaseSearch";

export type Crumb = { label: string; href?: string };

type ConsoleHeaderProps = {
  /** Desktop breadcrumb after the organization name. The last crumb is the current page. */
  breadcrumbs: Crumb[];
  /** Mobile app bar title. */
  title: string;
  /**
   * Mobile only: show a back button and a "more" button instead of the logo and actions
   * (case detail). The title is then set in mono, since it is a case reference.
   */
  backHref?: string;
};

/**
 * Top of every console page: the desktop top bar and the mobile app bar.
 * Render it first inside the page.
 */
export function ConsoleHeader({ breadcrumbs, title, backHref }: ConsoleHeaderProps) {
  return (
    <>
      <DesktopTopBar breadcrumbs={breadcrumbs} />
      {backHref ? <MobileDetailBar title={title} backHref={backHref} /> : <MobileAppBar title={title} />}
    </>
  );
}

function DesktopTopBar({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  const { organization } = useConsoleSession();
  const trail: Crumb[] = [{ label: organization }, ...breadcrumbs];

  return (
    <header className="hidden h-15 shrink-0 print:hidden items-center gap-3 border-b border-border-default bg-bg-surface px-6 lg:flex">
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-2 text-14 leading-[1.4] whitespace-nowrap">
          {trail.map((crumb, i) => {
            const current = i === trail.length - 1;
            return (
              <Fragment key={`${crumb.label}-${i}`}>
                {i > 0 && (
                  <li aria-hidden className="text-text-tertiary">
                    /
                  </li>
                )}
                <li>
                  {current ? (
                    <span aria-current="page" className="font-medium text-text-primary">
                      {crumb.label}
                    </span>
                  ) : crumb.href ? (
                    <Link href={crumb.href} className="text-text-tertiary hover:text-text-primary">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-tertiary">{crumb.label}</span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>

      <HeaderSearch />

      <button
        type="button"
        aria-label="Notifications"
        className="flex size-9 items-center justify-center rounded-md border border-border-default text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={Bell} size={18} />
      </button>

      <Link
        href={NEW_CHECK_HREF}
        className="flex h-9 items-center gap-1.5 rounded-md bg-accent pr-3.5 pl-3 text-13 leading-none font-semibold text-text-inverse hover:bg-accent/90"
      >
        <Icon icon={Plus} size={16} />
        New check
      </Link>
    </header>
  );
}

/** Top bar search. On the cases list it filters as you type; elsewhere Enter opens the list. */
function HeaderSearch() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useCaseSearch(inputRef);

  // ⌘K / Ctrl+K focuses the search box.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputRef]);

  return (
    <form
      role="search"
      onSubmit={search.onSubmit}
      className="flex h-9 w-75 items-center gap-2 rounded-md border border-border-default bg-bg-app pr-3 pl-2.5 focus-within:border-accent"
    >
      <Icon icon={Search} size={16} className="text-text-tertiary" />
      <label htmlFor={inputId} className="sr-only">
        Search cases
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={search.defaultValue}
        onChange={search.onChange}
        placeholder="Search address, case #, landlord"
        className="min-w-0 flex-1 bg-transparent text-13 leading-[1.4] text-text-primary outline-none placeholder:text-text-tertiary"
      />
      <kbd aria-hidden className="font-sans text-11 font-medium text-text-tertiary">
        ⌘K
      </kbd>
    </form>
  );
}

function MobileAppBar({ title }: { title: string }) {
  const session = useConsoleSession();
  return (
    <header className="flex items-center gap-2.5 border-b border-border-default bg-bg-surface px-4 py-2.5 lg:hidden print:hidden">
      <Link
        href="/advocate"
        aria-label="Standing home"
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-15 leading-none font-bold text-text-inverse"
      >
        S
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="text-16 leading-[1.2] font-semibold text-text-primary">{title}</h1>
        <button type="button" className="flex items-center gap-1 self-start text-12 leading-[1.2] text-text-tertiary">
          {session.organization}
          <Icon icon={ChevronDown} size={12} />
        </button>
      </div>
      <Link
        href={NEW_CHECK_HREF}
        aria-label="New check"
        className="flex size-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={Plus} size={20} />
      </Link>
      <button
        type="button"
        aria-label="Notifications"
        className="flex size-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={Bell} size={20} />
      </button>
      <span
        aria-label={session.fullName}
        role="img"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-12 leading-none font-semibold text-text-secondary"
      >
        {session.initials}
      </span>
    </header>
  );
}

function MobileDetailBar({ title, backHref }: { title: string; backHref: string }) {
  return (
    <header className="flex items-center gap-1 bg-bg-surface py-2 pr-2 pl-1 lg:hidden print:hidden">
      <Link
        href={backHref}
        aria-label="Back"
        className="flex size-10 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={ChevronLeft} size={20} />
      </Link>
      <h1 className="min-w-0 flex-1 font-mono text-14 leading-[1.4] text-text-primary">{title}</h1>
      <button
        type="button"
        aria-label="More actions"
        className="flex size-10 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={Ellipsis} size={20} />
      </button>
    </header>
  );
}
