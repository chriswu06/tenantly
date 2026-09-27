import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="my-0.5 h-3.5 w-24" />
      <Skeleton className="h-[46px] rounded-lg lg:h-11" />
    </div>
  );
}

/** Loading state for the advocate auth forms: heading, two fields and the submit button. */
export function AuthFormSkeleton() {
  return (
    <LoadingRegion label="Loading page" className="flex flex-col gap-4.5">
      <div className="flex flex-col gap-1 lg:gap-1.5">
        <Skeleton className="my-1 h-5 w-52 lg:h-6 lg:w-64" />
        <Skeleton className="my-[3px] h-3.5 w-full max-w-72" />
      </div>
      <FieldSkeleton />
      <FieldSkeleton />
      <Skeleton className="h-12 w-full rounded-lg lg:h-11" />
    </LoadingRegion>
  );
}
