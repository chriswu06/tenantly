import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page title and lead paragraph: 22px on mobile, 28px on desktop. */
export function PageHeading({
  title,
  description,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <h1 className="text-22 leading-[1.25] font-semibold text-text-primary md:text-28 md:leading-[1.2] md:tracking-[-0.42px]">
        {title}
      </h1>
      {description && <p className="text-15 leading-[1.45] text-text-secondary">{description}</p>}
    </div>
  );
}

/** Desktop two-column layout (main + 360px sidebar); a single column on mobile. */
export function TwoColumn({
  main,
  sidebar,
  className,
}: {
  main: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 p-5 md:px-6 md:pt-7 md:pb-12", className)}>
      <div className="mx-auto flex max-w-page flex-col gap-3.5 md:flex-row md:items-start md:gap-8">
        <div className="flex min-w-0 flex-col gap-3.5 md:flex-1 md:gap-5">{main}</div>
        {sidebar && (
          <aside className="flex flex-col gap-3.5 md:w-[300px] md:shrink-0 md:gap-4 lg:w-[360px]">{sidebar}</aside>
        )}
      </div>
    </div>
  );
}
