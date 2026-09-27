"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraState = "idle" | "starting" | "live" | "denied" | "unavailable";

/**
 * Opens the rear (or only) camera on demand and cleans up the stream on unmount.
 * Not started automatically, so pages never trigger a permission prompt on load.
 * `stream` can feed several <video> elements (e.g. the phone and webcam layouts).
 *
 * @example
 * const { stream, state, start } = useCamera();
 * <video ref={(el) => { if (el) el.srcObject = stream; }} autoPlay playsInline muted />
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>("idle");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const stop = useCallback(() => {
    release();
    setState("idle");
  }, [release]);

  const start = useCallback(
    async (deviceId?: string) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("unavailable");
        return;
      }
      release();
      setState("starting");
      try {
        const next = await navigator.mediaDevices.getUserMedia({
          video: deviceId
            ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
            : { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        streamRef.current = next;
        setStream(next);
        if (videoRef.current) videoRef.current.srcObject = next;
        setState("live");
        const all = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        setDevices(all.filter((device) => device.kind === "videoinput"));
      } catch (error) {
        setState(error instanceof DOMException && error.name === "NotAllowedError" ? "denied" : "unavailable");
      }
    },
    [release],
  );

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  return { videoRef, stream, state, devices, start, stop };
}

/** Grabs the current frame of a playing <video> as a JPEG. */
export async function captureFrame(video: HTMLVideoElement): Promise<Blob | null> {
  if (!video.videoWidth || !video.videoHeight) return null;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
}
