"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CameraState = "idle" | "starting" | "live" | "denied" | "unavailable";

/**
 * Opens the rear (or only) camera on demand and cleans up the stream on unmount.
 * Not started automatically, so pages never trigger a permission prompt on load.
 *
 * @example
 * const { videoRef, state, start } = useCamera();
 * <video ref={videoRef} autoPlay playsInline muted />
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>("idle");

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setState("idle");
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unavailable");
      return;
    }
    setState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setState("live");
    } catch {
      setState("denied");
    }
  }, []);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  return { videoRef, state, start, stop };
}
