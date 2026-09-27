"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ChevronDown, Pencil, Upload, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { Spinner } from "@/components/ui/Spinner";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { captureFrame, useCamera, type CameraState } from "@/hooks/useCamera";
import { UPLOAD_ACCEPT, useSummonsUpload } from "@/hooks/useSummonsUpload";
import { startManually } from "@/lib/cases/actions";

import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";

type CameraControls = ReturnType<typeof useCamera>;

type CaptureProps = {
  camera: CameraControls;
  pending: boolean;
  onCapture: (video: HTMLVideoElement | null) => void;
  onFile: (file: File | undefined) => void;
};

/**
 * Opens the camera when the screen opens, then "Take photo" / "Capture" uploads
 * the current frame as a JPEG. The phone layout and the webcam modal share one
 * camera stream.
 */
export function CameraCapture({ backdrop }: { backdrop?: ReactNode }) {
  const camera = useCamera();
  const { upload, pending } = useSummonsUpload();
  const { start } = camera;

  useEffect(() => {
    // The tenant chose "Scan summons", so asking for the camera now is expected.
    void start();
  }, [start]);

  async function onCapture(video: HTMLVideoElement | null) {
    if (!video || pending) return;
    const blob = await captureFrame(video);
    if (blob) upload(blob, "summons-photo.jpg");
  }

  const props: CaptureProps = { camera, pending, onCapture, onFile: (file) => upload(file) };

  return (
    <>
      <MobileCameraCapture {...props} />
      {backdrop}
      <WebcamModal {...props} />
    </>
  );
}

function MobileCameraCapture({ camera, pending, onCapture, onFile }: CaptureProps) {
  const uploadId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const live = camera.state === "live";

  return (
    <div className="flex flex-1 flex-col bg-bg-inverse md:hidden">
      <header className="flex h-14 shrink-0 items-center justify-between py-2 pr-3 pl-1">
        <Link
          href="/"
          aria-label="Close camera"
          className={iconButtonClassName("ghost", "text-text-inverse hover:bg-white/10")}
        >
          <Icon icon={X} size={20} />
        </Link>
        <h1 className="text-16 leading-[1.4] font-semibold text-text-inverse">Scan summons</h1>
        <ReadAloudButton className="text-text-inverse not-disabled:hover:bg-white/10" />
      </header>

      <div className="flex flex-1 flex-col items-center gap-4 px-5 pt-2 pb-5">
        <p className="text-center text-15 text-text-inverse">
          Place the first page of the summons inside the frame.
        </p>
        <Viewfinder variant="mobile" camera={camera} pending={pending} videoRef={videoRef} />
        <p className="text-center text-13 leading-[1.4] text-text-tertiary">
          Flat surface · Even lighting · Avoid glare
        </p>
        <div className="flex-1" />
        <div className="flex w-full items-center justify-between px-2">
          <label htmlFor={uploadId} className="group flex cursor-pointer flex-col items-center gap-1.5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-text-secondary text-text-inverse group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-2 group-has-focus-visible:outline-accent">
              <Icon icon={Upload} size={20} />
            </span>
            <span className="text-12 leading-[1.4] text-text-inverse">Upload</span>
            <input
              id={uploadId}
              type="file"
              accept={UPLOAD_ACCEPT}
              disabled={pending}
              className="sr-only"
              onChange={(event) => {
                onFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            aria-label={pending ? "Uploading photo" : "Take photo"}
            aria-disabled={!live || pending || undefined}
            aria-busy={pending || undefined}
            onClick={() => live && onCapture(videoRef.current)}
            className={cn(
              "flex size-20 items-center justify-center rounded-full border-4 border-text-tertiary bg-white text-accent transition-transform active:scale-95",
              (!live || pending) && "cursor-not-allowed opacity-60",
            )}
          >
            {pending && <Spinner size={24} />}
          </button>
          <form action={startManually} className="flex">
            <SubmitButton className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg">
              <span className="flex size-10 items-center justify-center rounded-lg bg-text-secondary text-text-inverse">
                <Icon icon={Pencil} size={20} />
              </span>
              <span className="text-12 leading-[1.4] text-text-inverse">Manual</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}

function WebcamModal({ camera, pending, onCapture, onFile }: CaptureProps) {
  const router = useRouter();
  const titleId = useId();
  const uploadId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const live = camera.state === "live";
  const currentDevice = camera.stream?.getVideoTracks()[0]?.getSettings().deviceId ?? "";
  const currentLabel =
    camera.devices.find((device) => device.deviceId === currentDevice)?.label || "Camera";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 hidden overflow-y-auto bg-bg-inverse/55 px-6 pt-[90px] pb-6 md:block">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="mx-auto flex w-full max-w-[760px] flex-col overflow-hidden rounded-xl bg-bg-surface shadow-[0_16px_48px_0_rgb(0_0_0/0.2)]"
      >
        <div className="flex h-15 items-center gap-3 border-b border-border-default pr-3 pl-6">
          <h1 id={titleId} className="min-w-0 flex-1 text-17 leading-[1.45] font-semibold">
            Scan with webcam
          </h1>
          <label className="relative flex max-w-[260px] min-w-0 items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-13 leading-none text-text-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
            <Icon icon={Camera} size={14} />
            <span aria-hidden className="truncate">
              {currentLabel}
            </span>
            <Icon icon={ChevronDown} size={14} className="text-text-tertiary" />
            <span className="sr-only">Camera</span>
            <select
              className="absolute inset-0 cursor-pointer appearance-none opacity-0"
              value={currentDevice}
              disabled={camera.devices.length < 2}
              onChange={(event) => void camera.start(event.target.value)}
            >
              {camera.devices.length ? (
                camera.devices.map((device, index) => (
                  <option key={device.deviceId || index} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))
              ) : (
                <option value="">Camera</option>
              )}
            </select>
          </label>
          <Link href="/" aria-label="Close" className={iconButtonClassName("ghost", "size-9 rounded-md")}>
            <Icon icon={X} size={18} />
          </Link>
        </div>

        <div className="flex flex-col gap-3.5 p-6">
          <Viewfinder variant="web" camera={camera} pending={pending} videoRef={videoRef} />
          <p className="text-center text-13 leading-[1.45] text-text-secondary">
            Hold the first page flat, about 12 inches from the camera. Avoid glare from windows or overhead
            lights.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-border-default px-6 pt-4 pb-5">
          <label
            htmlFor={uploadId}
            className="mr-auto flex cursor-pointer items-center gap-1.5 rounded-md text-13 leading-[1.45] font-semibold text-accent hover:underline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
          >
            <Icon icon={Upload} size={16} />
            Upload a file instead
            <input
              id={uploadId}
              type="file"
              accept={UPLOAD_ACCEPT}
              disabled={pending}
              className="sr-only"
              onChange={(event) => {
                onFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <Link href="/" className={buttonClassName("secondary", "md")}>
            Cancel
          </Link>
          <button
            type="button"
            aria-disabled={!live || pending || undefined}
            aria-busy={pending || undefined}
            onClick={() => live && onCapture(videoRef.current)}
            className={buttonClassName("primary", "md", cn((!live || pending) && "cursor-not-allowed opacity-60"))}
          >
            {pending ? <Spinner size={18} /> : <Icon icon={Camera} size={18} />}
            {pending ? "Uploading…" : "Capture"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Illustration colors for the viewfinder; they aren't design tokens.
const viewfinderStyles = {
  mobile: {
    frame: "h-[460px] rounded-lg bg-[#1f293b]",
    page: "top-[63px] h-[330px] w-[250px]",
    paper: "rotate-[1.5deg] rounded-[2px] bg-[#f7f7f5]",
    lines: "top-[29px] left-[30px] gap-5 [&>span]:h-1.5 [&>span]:rounded-[1px] [&>span]:bg-[#ccd1d9]",
    long: "w-[180px]",
    short: "w-[110px]",
    guide: "top-[40px] h-[376px] w-[270px] rounded-sm border-2",
    status: "top-[412px]",
  },
  web: {
    frame: "h-[400px] rounded-lg bg-bg-inverse",
    page: "top-[54px] h-[300px] w-[230px]",
    paper: "rotate-3 bg-[#edede8]",
    lines: "top-[26px] left-[29px] gap-[21px] [&>span]:h-[5px] [&>span]:bg-[#c7ccd4]",
    long: "w-40",
    short: "w-25",
    guide: "top-[30px] h-[330px] w-[250px] border-[2.5px]",
    status: "top-[360px]",
  },
} as const;

const linePattern = ["short", "long", "long"] as const;

const statusText: Record<CameraState, string> = {
  idle: "Starting camera…",
  starting: "Starting camera…",
  live: "Fit the page inside the frame",
  denied: "Camera blocked · upload a photo instead",
  unavailable: "No camera found · upload a photo instead",
};

function Viewfinder({
  variant,
  camera,
  pending,
  videoRef,
}: {
  variant: "mobile" | "web";
  camera: CameraControls;
  pending: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const style = viewfinderStyles[variant];
  const live = camera.state === "live" && camera.stream;
  // 10 text lines on the phone page, 9 on the webcam page.
  const lines = [...linePattern, ...linePattern, ...linePattern, ...(variant === "mobile" ? (["short"] as const) : [])];
  const label = pending ? "Uploading…" : statusText[camera.state];

  return (
    <div
      role="img"
      aria-label={live ? "Live camera preview" : `Camera preview. ${label}`}
      className={cn("relative w-full shrink-0 overflow-hidden", style.frame)}
    >
      {live ? (
        <>
          <video
            ref={(element) => {
              videoRef.current = element;
              if (element && element.srcObject !== camera.stream) element.srcObject = camera.stream;
            }}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 size-full object-cover"
          />
          <span aria-hidden className={cn("absolute left-1/2 -translate-x-1/2 border-accent", style.guide)} />
        </>
      ) : (
        <div aria-hidden className={cn("absolute left-1/2 -translate-x-1/2 opacity-40", style.page)}>
          <span className={cn("absolute inset-0", style.paper)} />
          <span className={cn("absolute flex flex-col", style.lines)}>
            {lines.map((length, index) => (
              <span key={index} className={style[length]} />
            ))}
          </span>
        </div>
      )}
      <span
        aria-live="polite"
        className={cn(
          "absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-13 leading-none font-medium whitespace-nowrap text-text-inverse",
          camera.state === "denied" || camera.state === "unavailable" ? "bg-danger-fg" : "bg-bg-inverse/80",
          style.status,
        )}
      >
        {(pending || camera.state === "starting") && <Spinner size={14} />}
        {label}
      </span>
    </div>
  );
}
