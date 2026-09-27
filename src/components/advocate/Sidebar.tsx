"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { consoleNav, isNavActive, settingsNav, type ConsoleNavItem } from "./console-config";
import { useConsoleSession } from "./ConsoleSession";

/** Desktop console navigation (Figma frame 11). Hidden below `lg`, where MobileTabBar takes over. */
export function Sidebar() {
  const pathname = usePathname();
  const session = useConsoleSession();

  return (
    <aside className="sticky top-0 hidden h-dvh print:hidden w-60 shrink-0 flex-col gap-1 border-r border-border-default bg-bg-surface px-3 py-4 lg:flex">
      <Link href="/advocate" className="flex items-center gap-2.5 rounded-md px-2 pt-1 pb-4">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-15 leading-none font-bold text-text-inverse">
          S
        </span>
        <span className="flex flex-col leading-[1.2]">
          <span className="text-15 leading-[1.2] font-semibold text-text-primary">Standing</span>
          <span className="text-12 leading-[1.2] text-text-tertiary">Advocate console</span>
        </span>
      </Link>

      <nav aria-label="Console" className="flex flex-1 flex-col gap-1">
        {consoleNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isNavActive(pathname, item.href)}
            count={item.href === "/advocate/cases" ? session.caseCount : undefined}
          />
        ))}
        <div className="flex-1" />
        <NavLink item={settingsNav} active={isNavActive(pathname, settingsNav.href)} />
      </nav>

      <div className="flex items-center gap-2.5 border-t border-border-default px-2 pt-3 pb-1">
        <span className="flex size-8 items-center justify-center rounded-full bg-bg-subtle text-12 leading-none font-semibold text-text-secondary">
          {session.initials}
        </span>
        <span className="flex min-w-0 flex-1 flex-col leading-[1.3]">
          <span className="truncate text-13 leading-[1.3] font-medium text-text-primary">{session.fullName}</span>
          <span className="truncate text-12 leading-[1.3] text-text-tertiary">{session.organization}</span>
        </span>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            title="Sign out"
            className="flex size-8 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-subtle hover:text-text-primary"
          >
            <Icon icon={LogOut} size={16} />
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({ item, active, count }: { item: ConsoleNavItem; active: boolean; count?: number }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-14 leading-[1.4]",
        active
          ? "bg-accent-subtle font-semibold text-accent"
          : "font-medium text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
      )}
    >
      <Icon icon={item.icon} size={18} />
      <span className="flex-1">{item.label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "rounded-[10px] px-[7px] py-px text-11 font-semibold",
            active ? "bg-accent text-text-inverse" : "bg-bg-subtle text-text-secondary",
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
