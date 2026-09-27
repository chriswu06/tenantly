import type { ComponentPropsWithRef } from "react";
import { CircleStop, Volume2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

type ReadAloudVariant = "icon" | "pill" | "inline";

type ReadAloudButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  /**
   * icon: 40px app bar button. pill: bordered "Listen" button in the web header.
   * inline: accent "Play" link next to a block of text.
   */
  variant?: ReadAloudVariant;
  playing?: boolean;
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
 * UI only: the caller owns playback and passes `playing` and `onClick`.
 *
 * @example <ReadAloudButton playing={isPlaying} onClick={toggle} />
 */
export function ReadAloudButton({
  variant = "icon",
  playing = false,
  type = "button",
  className,
  ...props
}: ReadAloudButtonProps) {
  const icon = playing ? CircleStop : Volume2;
  const label = labels[variant][playing ? "playing" : "idle"];

  if (variant === "icon") {
    return (
      <IconButton
        icon={icon}
        label={label}
        type={type}
        className={cn("text-text-secondary", className)}
        {...props}
      />
    );
  }

  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-13 leading-none whitespace-nowrap transition-colors",
        textVariantClasses[variant],
        className,
      )}
      {...props}
    >
      <Icon icon={icon} size={16} />
      {label}
    </button>
  );
}
