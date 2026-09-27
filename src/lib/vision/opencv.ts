"use client";

import type cvType from "@techstark/opencv-js";

export type OpenCV = typeof cvType;

let loading: Promise<{ cv: OpenCV }> | undefined;

/**
 * Loads OpenCV.js (13 MB, served from /vendor/opencv.js by scripts/copy-opencv.mjs)
 * the first time it's needed, and resolves once its WebAssembly runtime is ready.
 *
 * The module object has its own `then` (Emscripten), so it must never be passed
 * to resolve() directly or the promise would wait on it forever; it's wrapped instead.
 */
export async function loadOpenCV(): Promise<OpenCV> {
  loading ??= new Promise<{ cv: OpenCV }>((resolve, reject) => {
    const ready = () => {
      const cv = (window as unknown as { cv?: unknown }).cv as (OpenCV & { onRuntimeInitialized?: () => void }) | undefined;
      if (!cv) return reject(new Error("OpenCV didn’t load"));
      if (cv.Mat) return resolve({ cv });
      if (typeof (cv as { then?: unknown }).then === "function") {
        (cv as unknown as PromiseLike<OpenCV>).then((module) => resolve({ cv: module }));
      } else {
        cv.onRuntimeInitialized = () => resolve({ cv });
      }
    };
    if ((window as unknown as { cv?: unknown }).cv) return ready();
    const script = document.createElement("script");
    script.src = "/vendor/opencv.js";
    script.async = true;
    script.onload = ready;
    script.onerror = () => {
      loading = undefined;
      reject(new Error("Couldn’t download OpenCV"));
    };
    document.head.appendChild(script);
  });
  return (await loading).cv;
}
