import type { Metadata } from "next";
import { ConsoleSessionProvider } from "@/components/advocate/ConsoleSession";
import { MobileTabBar } from "@/components/advocate/MobileTabBar";
import { Sidebar } from "@/components/advocate/Sidebar";
import { requireAdvocate } from "@/lib/auth";
import { caseFilterCounts } from "@/lib/cases/queries";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Advocate console shell: sidebar on desktop, bottom tab bar on mobile.
 * Each page renders its own <ConsoleHeader> first, then its content.
 */
export default async function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const advocate = await requireAdvocate();
  const counts = await caseFilterCounts();
  const session = {
    fullName: advocate.fullName,
    firstName: advocate.fullName.trim().split(/\s+/)[0] ?? advocate.fullName,
    initials: advocate.initials,
    organization: advocate.organization.name,
    isAdmin: advocate.isAdmin,
    caseCount: counts.all,
  };

  return (
    <ConsoleSessionProvider value={session}>
      <div className="min-h-dvh lg:flex">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">{children}</div>
        <MobileTabBar />
      </div>
    </ConsoleSessionProvider>
  );
}
