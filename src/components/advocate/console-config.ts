import { ChartNoAxesColumn, Database, Folder, House, Settings, Users, type LucideIcon } from "lucide-react";

export type ConsoleNavItem = {
  href: string;
  label: string;
  /** Shorter label for the mobile tab bar. */
  shortLabel: string;
  icon: LucideIcon;
};

/** Main sections, in sidebar order. Settings sits apart at the bottom of the sidebar. */
export const consoleNav: ConsoleNavItem[] = [
  { href: "/advocate", label: "Overview", shortLabel: "Overview", icon: House },
  { href: "/advocate/cases", label: "Cases", shortLabel: "Cases", icon: Folder },
  { href: "/advocate/lookups", label: "License lookups", shortLabel: "Lookups", icon: Database },
  { href: "/advocate/reports", label: "Impact reports", shortLabel: "Reports", icon: ChartNoAxesColumn },
  { href: "/advocate/team", label: "Team", shortLabel: "Team", icon: Users },
];

export const settingsNav: ConsoleNavItem = {
  href: "/advocate/settings",
  label: "Settings",
  shortLabel: "Settings",
  icon: Settings,
};

/** True when `pathname` is inside the section at `href`. Overview matches only itself. */
export function isNavActive(pathname: string, href: string) {
  if (href === "/advocate") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Placeholder until Supabase Auth is wired up.
export const currentAdvocate = {
  name: "J. Rivera",
  initials: "JR",
  organization: "Public Justice Center",
  openCaseCount: 24,
};
