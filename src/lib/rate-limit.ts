import "server-only";
import { headers } from "next/headers";

/*
 * Small fixed-window rate limiter for the paid APIs (Gemini, ElevenLabs).
 * In memory, so on Vercel each instance counts separately: enough to stop a
 * runaway loop or casual abuse, not a determined attacker.
 */

const windows = new Map<string, { start: number; count: number }>();

/**
 * The caller's IP. On Vercel both headers are set by the platform (a client's own
 * X-Forwarded-For is overwritten), so they can't be spoofed there. Locally there's
 * no proxy and every request counts as "local".
 */
export async function clientKey(scope: string) {
  const h = await headers();
  const ip = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "local";
  return `${scope}:${ip}`;
}

/** True if the call may go ahead; false once `limit` calls happened in the last `windowMs`. */
export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || now - current.start >= windowMs) {
    windows.set(key, { start: now, count: 1 });
    if (windows.size > 10_000) windows.clear();
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}
