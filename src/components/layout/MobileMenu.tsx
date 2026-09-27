"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Globe, Volume2, X, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { advocateHref, homeLink, isActive, legalLinks, primaryLinks } from "./nav-links";

/**
 * Full-screen mobile menu. Uses a modal <dialog>, which gives focus trapping,
 * Escape to close and an inert background for free.
 *
 * @example <MobileMenu open={open} onClose={() => setOpen(false)} />
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menu"
      onClose={onClose}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg-surface p-0 text-text-primary backdrop:bg-transparent open:flex open:flex-col"
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border-default py-2 pr-3 pl-4">
        <Logo className="flex-1" onClick={close} />
        <IconButton icon={X} label="Close menu" onClick={close} />
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col overflow-y-auto pt-2 pb-4">
        <ul>
          {[homeLink, ...primaryLinks].map((link) => (
            <MenuLink key={link.href} {...link} active={isActive(pathname, link.href)} onNavigate={close} />
          ))}
        </ul>
        <Divider />
        <ul>
          {legalLinks.map((link) => (
            <MenuLink key={link.href} {...link} active={isActive(pathname, link.href)} onNavigate={close} />
          ))}
        </ul>
        <Divider />
        <PrefRow icon={Volume2} label="Read pages aloud" value="Off" />
        <PrefRow icon={Globe} label="Language" value="English" />
      </nav>

      <div className="flex shrink-0 flex-col gap-1.5 border-t border-border-default bg-bg-app px-5 pt-4 pb-7">
        <Link
          href={advocateHref}
          onClick={close}
          className="flex items-center gap-1.5 self-start rounded-md text-14 leading-[1.4] font-semibold text-accent"
        >
          For legal aid organizations
          <Icon icon={ArrowRight} size={16} />
        </Link>
        <p className="text-12 text-text-tertiary">Informational only. Not legal advice.</p>
      </div>
    </dialog>
  );
}

function MenuLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3.5 px-5 py-3.5 text-16 leading-[1.4]",
          active ? "bg-accent-subtle font-semibold text-accent" : "font-medium text-text-primary hover:bg-bg-subtle",
        )}
      >
        <Icon icon={icon} size={20} className={active ? "text-accent" : "text-text-secondary"} />
        <span className="flex-1">{label}</span>
        <Icon icon={ChevronRight} size={18} className="text-text-tertiary" />
      </Link>
    </li>
  );
}

function PrefRow({ icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5 px-5 py-3.5">
      <Icon icon={icon} size={20} className="text-text-secondary" />
      <span className="flex-1 text-16 leading-[1.4] font-medium">{label}</span>
      <button
        type="button"
        aria-label={`${label}: ${value}`}
        className="flex items-center gap-1.5 rounded-lg border border-border-default px-2.5 py-1.5 text-13 leading-none font-medium text-text-secondary"
      >
        {value}
        <Icon icon={ChevronDown} size={14} className="text-text-tertiary" />
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="px-5 py-2">
      <div className="h-px bg-border-default" />
    </div>
  );
}
