import type { Metadata } from "next";
import { AppBar } from "@/components/layout/AppBar";
import { OutcomeForm } from "@/components/tenant/results/OutcomeForm";
import { requireTenantCase } from "@/lib/cases/session";

export const metadata: Metadata = { title: "Report outcome" };

export default async function OutcomePage() {
  const row = await requireTenantCase();

  return (
    <>
      <AppBar title="Report outcome" backHref="/legal-help" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <OutcomeForm defaultValue={row.outcome} />
      </main>
    </>
  );
}
