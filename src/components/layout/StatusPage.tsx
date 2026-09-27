import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Footer } from "./Footer";
import { MobileSiteHeader, SiteHeader } from "./SiteHeader";

type StatusPageProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Action buttons or links, primary first. */
  children: React.ReactNode;
};

/**
 * Full-page message for not-found and error states. These render outside
 * the route-group layouts, so they bring their own header and footer.
 * No Figma frame exists for these; built from the Start screen's patterns.
 */
export function StatusPage({ icon, title, description, children }: StatusPageProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MobileSiteHeader />
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-3xl bg-accent-subtle text-accent">
            <Icon icon={icon} size={22} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-22 font-semibold md:text-26">{title}</h1>
            <p className="text-15 text-text-secondary">{description}</p>
          </div>
          <div className="flex w-full flex-col gap-2 pt-2 md:w-auto md:flex-row">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
