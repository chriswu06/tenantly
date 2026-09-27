import { Book, Eye, House, Info, Lock, Scale, type LucideIcon } from "lucide-react";

type NavLink = { href: string; label: string; icon: LucideIcon };

// Desktop header links (Figma 13) and the first group in the mobile menu (Figma 49).
export const primaryLinks: NavLink[] = [
  { href: "/how-it-works", label: "How it works", icon: Info },
  { href: "/free-legal-help", label: "Free legal help", icon: Scale },
  { href: "/license-law", label: "About the license law", icon: Book },
];

export const homeLink: NavLink = { href: "/", label: "Check my landlord", icon: House };

export const legalLinks: NavLink[] = [
  { href: "/privacy", label: "Privacy", icon: Lock },
  { href: "/accessibility", label: "Accessibility", icon: Eye },
];

export const advocateHref = "/advocate/sign-in";

/** True when `href` is the current page or a parent of it. */
export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
