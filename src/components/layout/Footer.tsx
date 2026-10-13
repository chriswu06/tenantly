"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";
import { advocateHref, isActive, legalLinks } from "./nav-links";

/**
 * Site footer. Below `md` it shows only on the landing page; every other mobile
 * screen ends in its own action bar.
 */
export function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className={cn(
        "shrink-0 bg-brand-night px-5 text-white/60 print:hidden md:block md:px-6",
        pathname === "/" ? "block" : "hidden",
      )}
    >
      <div className="mx-auto flex max-w-page flex-col gap-4 py-6 text-13 leading-[1.4] md:flex-row md:items-center md:gap-6 md:py-4.5">
        <ul className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-2 font-semibold text-white">
            <LogoMark className="size-5" />© {new Date().getFullYear()} Tenantly
          </li>
          {legalLinks.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn("rounded-md hover:text-white", active && "font-semibold text-white")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li>Not legal advice</li>
        </ul>
        <Link href={advocateHref} className="flex items-center gap-1.5 rounded-md font-semibold text-brand-teal hover:text-white">
          For legal aid organizations
          <Icon icon={ArrowRight} size={14} />
        </Link>
      </div>
    </footer>
  );
}
