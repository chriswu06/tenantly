"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { advocateHref, isActive, legalLinks } from "./nav-links";

/**
 * Desktop site footer. Hidden below `md`, where each mobile screen ends in its
 * own action bar.
 */
export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="hidden shrink-0 border-t print:hidden border-border-default bg-bg-surface px-6 md:block">
      <div className="mx-auto flex max-w-page items-center gap-6 py-4.5 text-13 leading-[1.4]">
        <ul className="flex flex-1 flex-wrap items-center gap-5 text-text-tertiary">
          <li>© {new Date().getFullYear()} Standing</li>
          {legalLinks.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn("rounded-md hover:text-text-primary", active && "font-semibold text-text-primary")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li>Not legal advice</li>
        </ul>
        <Link href={advocateHref} className="flex items-center gap-1.5 rounded-md font-semibold text-accent">
          For legal aid organizations
          <Icon icon={ArrowRight} size={14} />
        </Link>
      </div>
    </footer>
  );
}
