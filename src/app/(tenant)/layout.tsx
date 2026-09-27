import { SiteShell } from "@/components/layout/SiteShell";

export default function TenantLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell>{children}</SiteShell>;
}
