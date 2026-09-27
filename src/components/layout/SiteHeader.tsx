"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Volume2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { isActive, primaryLinks } from "./nav-links";

/**
 * Desktop site header (Figma 13 · Web — Start & upload). Hidden below `md`,
 * where each mobile screen has its own app bar; the Start screen uses
 * `MobileSiteHeader` below.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="hidden h-16 shrink-0 items-center gap-8 border-b border-border-default bg-bg-surface px-6 md:flex lg:px-12">
      <Logo />

      <nav aria-label="Main" className="flex-1">
        <ul className="flex items-center gap-7">
          {primaryLinks.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md text-14 font-medium whitespace-nowrap",
                    active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Placeholders until B's ReadAloudButton and LanguageSelect merge. */}
      <div className="flex items-center gap-2">
        <UtilityButton icon={Volume2} label="Listen" />
        <UtilityButton icon={Globe} label="English" />
      </div>
    </header>
  );
}

/**
 * Mobile app bar with the brand, Listen, language and menu
 * (Figma 01 · Start). Hidden from `md` up, where `SiteHeader` takes over.
 */
export function MobileSiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border-default bg-bg-surface py-2 pr-3 pl-4 md:hidden">
      <Logo className="flex-1" />
      <div className="flex items-center gap-1">
        {/* Placeholders until B's ReadAloudButton and LanguageSelect merge. */}
        <button
          type="button"
          aria-label="Listen"
          className="flex size-10 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle"
        >
          <Icon icon={Volume2} size={20} />
        </button>
        <button
          type="button"
          aria-label="Language: English"
          className="flex items-center gap-1.5 rounded-lg border border-border-default py-1.5 pr-2.5 pl-2 text-13 leading-none font-medium text-text-secondary"
        >
          <Icon icon={Globe} size={16} />
          EN
        </button>
        <MobileMenu />
      </div>
    </header>
  );
}

function UtilityButton({ icon, label }: { icon: typeof Globe; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-lg border border-border-default py-2 pr-3 pl-2.5 text-13 leading-none font-medium text-text-secondary hover:bg-bg-subtle"
    >
      <Icon icon={icon} size={16} />
      {label}
    </button>
  );
}
