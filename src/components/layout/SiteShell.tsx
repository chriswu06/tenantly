import { Footer } from "./Footer";
import { SiteHeader } from "./SiteHeader";

/**
 * Page chrome for tenant and public pages: desktop header and footer around
 * the page. On mobile both are hidden and each page brings its own app bar.
 */
export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-aurora">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-grid-ink [mask-image:linear-gradient(to_bottom,black_20%,transparent)] print:hidden"
      />
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
