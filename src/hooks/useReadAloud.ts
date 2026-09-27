"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
 * Read aloud: POSTs text to /api/tts and plays the MP3 it returns. One player
 * is shared by every button on the page, so the header's "Listen" and the app
 * bar's speaker icon show the same state and stop each other.
 */

export type ReadAloudStatus = "idle" | "loading" | "playing";

const MAX_CHARS = 2500;

let status: ReadAloudStatus = "idle";
let audio: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let request: AbortController | null = null;
const listeners = new Set<() => void>();

function setStatus(next: ReadAloudStatus) {
  status = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function cleanup() {
  request?.abort();
  request = null;
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio = null;
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
}

export function stopReadAloud() {
  cleanup();
  if (status !== "idle") setStatus("idle");
}

/** Collapses whitespace and trims to what the TTS endpoint accepts. */
export function prepareSpeechText(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_CHARS) return clean;
  const cut = clean.slice(0, MAX_CHARS);
  const sentenceEnd = cut.lastIndexOf(". ");
  return sentenceEnd > MAX_CHARS * 0.6 ? cut.slice(0, sentenceEnd + 1) : cut;
}

async function play(text: string) {
  cleanup();
  const body = prepareSpeechText(text);
  if (!body) return;

  const controller = new AbortController();
  request = controller;
  setStatus("loading");
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: body }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Read aloud failed (${res.status})`);
    const blob = await res.blob();
    if (controller.signal.aborted) return;

    objectUrl = URL.createObjectURL(blob);
    const player = new Audio(objectUrl);
    audio = player;
    player.addEventListener("ended", () => {
      if (audio === player) stopReadAloud();
    });
    player.addEventListener("error", () => {
      if (audio === player) stopReadAloud();
    });
    await player.play();
    if (audio === player) setStatus("playing");
  } catch (error) {
    // Quietly give up: the page text is still there to read.
    if (!controller.signal.aborted) console.warn("Read aloud unavailable", error);
    if (request === controller) stopReadAloud();
  } finally {
    if (request === controller) request = null;
  }
}

/**
 * @example
 * const { status, toggle } = useReadAloud();
 * <button onClick={() => toggle(text)}>{status === "idle" ? "Listen" : "Stop"}</button>
 */
export function useReadAloud() {
  const current = useSyncExternalStore(
    subscribe,
    () => status,
    () => "idle" as const,
  );

  const toggle = useCallback((text: string) => {
    if (status !== "idle") stopReadAloud();
    else void play(text);
  }, []);

  return { status: current, active: current !== "idle", toggle, stop: stopReadAloud };
}

function isShown(element: HTMLElement) {
  return typeof element.checkVisibility === "function" ? element.checkVisibility() : element.getClientRects().length > 0;
}

/**
 * The visible text of the page's <main>, for reading aloud. Skips the progress
 * stepper and app bar, and anything hidden at this screen size.
 */
export function mainText() {
  const main = document.querySelector("main");
  if (!(main instanceof HTMLElement)) return "";
  return Array.from(main.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .filter((child) => !child.matches("nav, header, [aria-hidden='true']") && isShown(child))
    .map((child) => child.innerText)
    .join("\n");
}
