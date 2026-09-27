import { AppBar } from "@/components/layout/AppBar";
import { CaseBarSkeleton } from "@/components/tenant/CaseBar";
import { ConsentFormSkeleton } from "@/components/tenant/ConsentForm";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/** Share with legal aid while the organizations and case details load. Mirrors `page.tsx`. */
export default function ShareLoading() {
  return (
    <>
      <AppBar title="Share with legal aid" backHref="/results" className="md:hidden" />
      <main className="flex flex-1 flex-col">
        <CaseBarSkeleton />

        <LoadingRegion label="Loading sharing options" className="flex flex-1 flex-col md:px-6 md:pt-7 md:pb-12">
          <div className="mx-auto flex w-full max-w-page flex-1 flex-col md:flex-row md:items-start md:gap-8">
            <div className="flex min-w-0 flex-1 flex-col">
              <ConsentFormSkeleton />
            </div>

            <aside aria-hidden className="hidden shrink-0 flex-col gap-4 md:flex md:w-[300px] lg:w-[360px]">
              <div className="flex flex-col gap-3 rounded-[10px] border border-border-default bg-bg-surface p-4">
                <SkeletonLine width="w-32" lineClassName="h-[20.3px]" />
                <div className="flex flex-col gap-3">
                  {[2, 1, 2].map((lines, index) => (
                    <div key={index} className="flex gap-2.5">
                      <Skeleton className="mt-px size-4 shrink-0 rounded-sm" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        {Array.from({ length: lines }, (_, line) => (
                          <SkeletonLine key={line} width={line === lines - 1 && lines > 1 ? "w-2/5" : "w-full"} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-[10px] border border-border-default bg-bg-app p-4">
                <SkeletonLine width="w-28" lineClassName="h-[20.3px]" />
                <div className="flex flex-col">
                  <SkeletonLine />
                  <SkeletonLine />
                  <SkeletonLine width="w-1/4" />
                </div>
              </div>
            </aside>
          </div>
        </LoadingRegion>
      </main>
    </>
  );
}

/** A text line (13px/18.85px by default) holding a placeholder bar of the given width. */
function SkeletonLine({ width = "w-full", lineClassName = "h-[18.85px]" }: { width?: string; lineClassName?: string }) {
  return (
    <div className={cn("flex items-center", lineClassName)}>
      <Skeleton className={cn("h-3", width)} />
    </div>
  );
}
