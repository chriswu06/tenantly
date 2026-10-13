import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

type LogoProps = {
  /** Second line under the wordmark, e.g. "For legal aid organizations". */
  subtitle?: string;
  /** White wordmark for the dark advocate brand panel. */
  inverse?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
};

/** The house mark and Tenantly wordmark. Links home. */
export function Logo({ subtitle, inverse, href = "/", className, onClick }: LogoProps) {
  return (
    <Link href={href} onClick={onClick} className={cn("flex items-center gap-2.5 rounded-md", className)}>
      <LogoMark />
      {subtitle ? (
        <span className="flex flex-col leading-[1.2]">
          <span
            className={cn(
              "leading-[1.2] font-semibold",
              inverse ? "text-16 text-text-inverse" : "text-15 text-text-primary",
            )}
          >
            Tenantly
          </span>
          <span className="text-12 leading-[1.2] text-text-tertiary">{subtitle}</span>
        </span>
      ) : (
        <span className={cn("text-17 font-semibold", inverse ? "text-text-inverse" : "text-text-primary")}>
          Tenantly
        </span>
      )}
    </Link>
  );
}
