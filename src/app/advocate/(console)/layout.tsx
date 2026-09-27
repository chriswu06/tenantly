import { MobileTabBar } from "@/components/advocate/MobileTabBar";
import { Sidebar } from "@/components/advocate/Sidebar";

/**
 * Advocate console shell: sidebar on desktop, bottom tab bar on mobile.
 * Each page renders its own <ConsoleHeader> first, then its content.
 */
export default function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">{children}</div>
      <MobileTabBar />
    </div>
  );
}
