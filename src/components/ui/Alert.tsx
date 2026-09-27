import type { ComponentPropsWithRef, ReactNode } from "react";
import { CircleAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type AlertTone = "warn" | "danger";

const toneClasses: Record<AlertTone, { box: string; accent: string }> = {
  warn: { box: "border-warning-border bg-warning-bg", accent: "text-warning-fg" },
  danger: { box: "border-danger-border bg-danger-bg", accent: "text-danger-fg" },
};

const defaultIcon: Record<AlertTone, LucideIcon> = {
  warn: TriangleAlert,
  danger: CircleAlert,
};

type AlertProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  tone: AlertTone;
  title: ReactNode;
  /** Overrides the tone's default icon, e.g. Clock for a deadline warning. */
  icon?: LucideIcon;
};

/**
 * @example <Alert tone="warn" icon={Clock} title="Court date in 17 days">Bring your receipt.</Alert>
 */
export function Alert({ tone, title, icon, className, children, ...props }: AlertProps) {
  const styles = toneClasses[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex items-start gap-2.5 rounded-lg border p-3 text-13", styles.box, className)}
      {...props}
    >
      <Icon icon={icon ?? defaultIcon[tone]} size={18} className={styles.accent} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={cn("font-semibold", styles.accent)}>{title}</p>
        {children && <div className="leading-[1.45] text-text-primary">{children}</div>}
      </div>
    </div>
  );
}
