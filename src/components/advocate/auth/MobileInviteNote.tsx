"use client";

import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/** Mobile "Access is by invitation" note. Sign-up (frame 26) leaves it out: the visitor already has an invite. */
export function MobileInviteNote({ note }: { note: string }) {
  const pathname = usePathname();
  if (pathname === "/advocate/sign-up") return null;

  return (
    <p className="mt-auto flex items-center justify-center gap-1.5 pt-6 text-12 text-text-tertiary lg:hidden">
      <Icon icon={Lock} size={14} />
      {note}
    </p>
  );
}
