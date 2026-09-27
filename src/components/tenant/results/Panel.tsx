import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** White bordered card. 8px radius on mobile, 10px in the web frames. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface md:rounded-[10px]",
        className,
      )}
      {...props}
    />
  );
}

type PanelHeaderProps = {
  title: ReactNode;
  /** Secondary line under the title. */
  subtitle?: ReactNode;
  /** Shown at the end of the row, e.g. a Badge or Copy button. */
  action?: ReactNode;
  className?: string;
};

/** Panel title row: 14px semibold, 48px tall on desktop. */
export function PanelHeader({ title, subtitle, action, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-border-default px-4 py-3",
        !subtitle && "md:h-12 md:py-0",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
        <h2 className="text-14 leading-[1.4] font-semibold text-text-primary md:leading-[1.45]">{title}</h2>
        {subtitle && <p className="text-12 text-text-tertiary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Label/value row used in detail cards. */
export function KeyValue({
  label,
  children,
  className,
  labelClassName,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b border-border-default py-2 text-13 leading-[1.4] last:border-b-0",
        className,
      )}
    >
      <dt className={cn("w-[110px] shrink-0 text-text-secondary", labelClassName)}>{label}</dt>
      <dd className="min-w-0 flex-1 font-medium text-text-primary">{children}</dd>
    </div>
  );
}
