import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Secondary "continue" button that keeps the tenant flow moving where the design has no button for it. */
export function NextStepLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={buttonClassName("secondary", "responsive", cn("w-full", className))}>
      {children}
      <Icon icon={ArrowRight} size={18} />
    </Link>
  );
}
