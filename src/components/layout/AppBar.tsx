"use client";

import Link from "next/link";
import { ChevronLeft, Menu } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { IconButton, iconButtonClassName } from "@/components/ui/IconButton";
import { LanguageSelect, type LanguageCode } from "@/components/tenant/LanguageSelect";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
import { cn } from "@/lib/utils";

type AppBarProps = {
  /** Page title. Without one, the bar shows the Tenantly brand and the menu button (start screen). */
  title?: string;
  backHref?: string;
  readingAloud?: boolean;
  onReadAloud?: () => void;
  language?: LanguageCode;
  onLanguageChange?: (code: LanguageCode) => void;
  onMenuClick?: () => void;
  className?: string;
};

/**
 * Mobile tenant app bar.
 *
 * @example <AppBar title="Scan summons" backHref="/" />
 */
export function AppBar({
  title,
  backHref,
  readingAloud,
  onReadAloud,
  language,
  onLanguageChange,
  onMenuClick,
  className,
}: AppBarProps) {
  const isHome = !title;

  return (
    <header
      className={cn(
        "flex items-center border-b border-border-default bg-bg-surface py-2 pr-3 print:hidden",
        isHome ? "gap-2 pl-4" : "gap-1 pl-1",
        className,
      )}
    >
      {isHome ? (
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 rounded-md">
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-15 leading-none font-bold text-text-inverse"
          >
            T
          </span>
          <span className="text-17 font-semibold text-text-primary">Tenantly</span>
        </Link>
      ) : (
        <>
          {backHref && (
            <Link href={backHref} aria-label="Back" className={iconButtonClassName("ghost")}>
              <Icon icon={ChevronLeft} size={20} />
            </Link>
          )}
          <p className={cn("min-w-0 flex-1 truncate text-16 font-semibold text-text-primary", !backHref && "pl-3")}>
            {title}
          </p>
        </>
      )}
      <div className="flex shrink-0 items-center gap-1">
        <ReadAloudButton playing={readingAloud} onClick={onReadAloud} />
        <LanguageSelect value={language} onChange={onLanguageChange} />
        {isHome && <IconButton icon={Menu} label="Open menu" onClick={onMenuClick} />}
      </div>
    </header>
  );
}
