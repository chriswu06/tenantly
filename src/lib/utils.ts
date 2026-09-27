import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom tokens from globals.css. Without this it
// reads `text-15` as a text color and drops it when merged with `text-text-primary`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["12", "13", "14", "15", "16", "17", "18", "20", "22", "26", "36", "40"],
      color: [
        "bg-app", "bg-surface", "bg-subtle", "bg-inverse",
        "text-primary", "text-secondary", "text-tertiary", "text-inverse",
        "border-default", "border-strong",
        "accent", "accent-subtle", "accent-border",
        "success-fg", "success-bg", "success-border",
        "warning-fg", "warning-bg", "warning-border",
        "danger-fg", "danger-bg", "danger-border",
        "neutral-fg", "neutral-bg", "neutral-border",
      ],
      shadow: ["card"],
    },
  },
});

/** Merge class names, letting later Tailwind classes override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
