import type { ComponentPropsWithRef, ReactNode } from "react";
import { Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type" | "children"> & {
  children?: ReactNode;
};

/**
 * Native checkbox with the Figma box styling. `className` applies to the <label>;
 * other props go to the <input>.
 *
 * @example <Checkbox checked={done} onChange={(e) => setDone(e.target.checked)}>Photo ID</Checkbox>
 */
export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 text-14 leading-[1.4] text-text-primary",
        "has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <span className="relative flex size-5 shrink-0">
        <input
          type="checkbox"
          className="peer size-5 appearance-none rounded-sm border-[1.5px] border-border-strong bg-bg-surface transition-colors checked:border-accent checked:bg-accent disabled:cursor-not-allowed"
          {...props}
        />
        <Icon
          icon={Check}
          size={14}
          className="pointer-events-none absolute inset-0 m-auto hidden text-text-inverse peer-checked:block"
        />
      </span>
      {children}
    </label>
  );
}
