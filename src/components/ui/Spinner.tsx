import { LoaderCircle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Spinning loader in the current text color. Decorative: pair it with visible or sr-only text. */
export function Spinner({ size = 16, className }: { size?: 14 | 16 | 18 | 20 | 22 | 24; className?: string }) {
  return <Icon icon={LoaderCircle} size={size} className={cn("motion-safe:animate-spin", className)} />;
}
