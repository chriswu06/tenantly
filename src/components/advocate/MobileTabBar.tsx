"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { consoleNav, isNavActive } from "./console-config";

// Case detail pages show their own action footer instead of the tab bar.
const CASE_DETAIL = /^\/advocate\/cases\/[^/]+/;

/** Mobile console navigation. Hidden from `lg` up, where Sidebar takes over. */
export function MobileTabBar() {
  const pathname = usePathname();
  if (CASE_DETAIL.test(pathname)) return null;

  return (
    <nav
      aria-label="Console"
      className="fixed inset-x-0 bottom-0 z-10 flex border-t print:hidden border-border-default bg-bg-surface px-2 pt-2 pb-6 lg:hidden"
    >
      {consoleNav.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1 text-11 leading-none",
              active ? "font-semibold text-accent" : "font-medium text-text-tertiary",
            )}
          >
            <Icon icon={item.icon} size={22} />
            {item.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
