import { Footer } from "./Footer";
import { SiteHeader } from "./SiteHeader";

/**
 * Page chrome for tenant and public pages: desktop header and footer around
 * the page. On mobile both are hidden and each page brings its own app bar.
 */
export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
