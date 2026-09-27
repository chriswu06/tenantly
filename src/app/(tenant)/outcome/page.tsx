import type { Metadata } from "next";
import { AppBar } from "@/components/layout/AppBar";
import { OutcomeForm } from "@/components/tenant/results/OutcomeForm";

export const metadata: Metadata = { title: "Report outcome" };

export default function OutcomePage() {
  return (
    <>
      <AppBar title="Report outcome" backHref="/legal-help" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <OutcomeForm />
      </main>
    </>
  );
}
