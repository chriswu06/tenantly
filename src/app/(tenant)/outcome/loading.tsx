import { AppBar } from "@/components/layout/AppBar";
import { OutcomeFormSkeleton } from "@/components/tenant/results/OutcomeForm";
import { LoadingRegion } from "@/components/ui/Skeleton";

/** Report outcome while the form loads. Mirrors `page.tsx`. */
export default function OutcomeLoading() {
  return (
    <>
      <AppBar title="Report outcome" backHref="/legal-help" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <LoadingRegion label="Loading the outcome form" className="flex flex-1 flex-col">
          <OutcomeFormSkeleton />
        </LoadingRegion>
      </main>
    </>
  );
}
