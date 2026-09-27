"use client";

import { useEffect, type ComponentPropsWithRef } from "react";
import { usePathname } from "next/navigation";
import { CircleStop, LoaderCircle, Volume2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { mainText, useReadAloud } from "@/hooks/useReadAloud";
import { cn } from "@/lib/utils";

type ReadAloudVariant = "icon" | "pill" | "inline";

type ReadAloudButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  /**
   * icon: 40px app bar button. pill: bordered "Listen" button in the web header.
   * inline: accent "Play" link next to a block of text.
   */
  variant?: ReadAloudVariant;
  /** Only when the caller owns playback (with `onClick`). */
  playing?: boolean;
  /** What to read. Defaults to the visible text of the page's <main>. */
  text?: string;
};

const labels: Record<ReadAloudVariant, { idle: string; playing: string }> = {
  icon: { idle: "Read this page aloud", playing: "Stop reading aloud" },
  pill: { idle: "Listen", playing: "Stop" },
  inline: { idle: "Play", playing: "Stop" },
};

const textVariantClasses: Record<Exclude<ReadAloudVariant, "icon">, string> = {
  pill: "rounded-lg border border-border-default py-2 pr-3 pl-2.5 font-medium text-text-secondary hover:bg-bg-subtle",
  inline: "font-semibold text-accent hover:underline",
};

/**
 * Reads the page (or `text`) aloud through /api/tts. Every instance shares one
 * player, so any button stops what another started. Pass `onClick` and
 * `playing` to take over playback instead.
 *
 * @example <ReadAloudButton variant="inline" text="My landlord doesn’t have…" />
 */
export function ReadAloudButton({
  variant = "icon",
  playing: playingProp,
  text,
  type = "button",
  className,
  onClick,
  ...props
}: ReadAloudButtonProps) {
  const pathname = usePathname();
  const { status, toggle, stop } = useReadAloud();
  const controlled = onClick !== undefined;
  const loading = !controlled && status === "loading";
  const playing = controlled ? Boolean(playingProp) : status !== "idle";

  // A new page means new text: stop reading the old one.
  useEffect(() => stop, [pathname, stop]);

  const handleClick: typeof onClick = controlled ? onClick : () => toggle(text ?? mainText());
  const icon = loading ? LoaderCircle : playing ? CircleStop : Volume2;
  const label = labels[variant][playing ? "playing" : "idle"];
  const iconClass = loading ? "motion-safe:animate-spin" : undefined;

  if (variant === "icon") {
    return (
      <IconButton
        icon={icon}
        label={label}
        type={type}
        aria-busy={loading || undefined}
        onClick={handleClick}
        className={cn("text-text-secondary", loading && "[&_svg]:motion-safe:animate-spin", className)}
        {...props}
      />
    );
  }

  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-13 leading-none whitespace-nowrap transition-colors",
        textVariantClasses[variant],
        className,
      )}
      {...props}
    >
      <Icon icon={icon} size={16} className={iconClass} />
      {label}
    </button>
  );
}
