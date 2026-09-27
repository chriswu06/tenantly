"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { LanguageSelect } from "@/components/tenant/LanguageSelect";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
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
    <header className="hidden h-16 shrink-0 print:hidden items-center gap-8 border-b border-border-default bg-bg-surface px-6 md:flex lg:px-12">
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

      {/* TODO: wire playback and language state once the i18n/read-aloud hooks land. */}
      <div className="flex items-center gap-2">
        <ReadAloudButton variant="pill" />
        <LanguageSelect variant="full" />
      </div>
    </header>
  );
}

/**
 * Mobile start-screen app bar with the menu (Figma 01 · Start, menu 49).
 * Hidden from `md` up, where `SiteHeader` takes over.
 */
export function MobileSiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppBar className="shrink-0 md:hidden" onMenuClick={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
