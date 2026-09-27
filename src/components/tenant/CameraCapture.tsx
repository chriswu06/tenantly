"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Check, ChevronDown, Pencil, Upload, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { ReadAloudButton } from "@/components/tenant/ReadAloudButton";

import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";

const EXTRACTING = "/scan/extracting";

/**
 * Mobile camera screen (frame 02). The viewfinder is illustrated for now;
 * `useCamera` will feed a live <video> into it once capture is wired up.
 */
export function MobileCameraCapture() {
  const router = useRouter();
  const uploadId = useId();

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
        <Viewfinder variant="mobile" />
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
              accept="image/*,application/pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) router.push(file.size > 10 * 1024 * 1024 ? "/scan/upload-failed" : EXTRACTING);
              }}
            />
          </label>
          <Link
            href={EXTRACTING}
            aria-label="Take photo"
            className="size-20 rounded-full border-4 border-text-tertiary bg-white transition-transform active:scale-95"
          />
          <Link href="/scan/review" className="group flex flex-col items-center gap-1.5 rounded-lg">
            <span className="flex size-10 items-center justify-center rounded-lg bg-text-secondary text-text-inverse">
              <Icon icon={Pencil} size={20} />
            </span>
            <span className="text-12 leading-[1.4] text-text-inverse">Manual</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Web webcam modal over the start screen (frame 14). */
export function WebcamModal() {
  const router = useRouter();
  const titleId = useId();

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
          <label className="relative flex items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-13 leading-none text-text-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
            <Icon icon={Camera} size={14} />
            <span aria-hidden>FaceTime HD Camera</span>
            <Icon icon={ChevronDown} size={14} className="text-text-tertiary" />
            <span className="sr-only">Camera</span>
            <select className="absolute inset-0 cursor-pointer appearance-none opacity-0" defaultValue="facetime">
              <option value="facetime">FaceTime HD Camera</option>
            </select>
          </label>
          <Link href="/" aria-label="Close" className={iconButtonClassName("ghost", "size-9 rounded-md")}>
            <Icon icon={X} size={18} />
          </Link>
        </div>

        <div className="flex flex-col gap-3.5 p-6">
          <Viewfinder variant="web" />
          <p className="text-center text-13 leading-[1.45] text-text-secondary">
            Hold the first page flat, about 12 inches from the camera. Avoid glare from windows or overhead
            lights.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-border-default px-6 pt-4 pb-5">
          <Link
            href="/"
            className="mr-auto flex items-center gap-1.5 rounded-md text-13 leading-[1.45] font-semibold text-accent hover:underline"
          >
            <Icon icon={Upload} size={16} />
            Upload a file instead
          </Link>
          <Link href="/" className={buttonClassName("secondary", "md")}>
            Cancel
          </Link>
          <Link href={EXTRACTING} className={buttonClassName("primary", "md")}>
            <Icon icon={Camera} size={18} />
            Capture
          </Link>
        </div>
      </div>
    </div>
  );
}

// Illustration colors from the Figma viewfinder; they aren't design tokens.
const viewfinderStyles = {
  mobile: {
    frame: "h-[460px] rounded-lg bg-[#1f293b]",
    page: "top-[63px] h-[330px] w-[250px]",
    paper: "rotate-[1.5deg] rounded-[2px] bg-[#f7f7f5]",
    lines: "top-[29px] left-[30px] gap-5 [&>span]:h-1.5 [&>span]:rounded-[1px] [&>span]:bg-[#ccd1d9]",
    long: "w-[180px]",
    short: "w-[110px]",
    outline: "-inset-1.5 rotate-[1.5deg] rounded-sm border-2",
    status: "top-[412px]",
    label: "Document detected",
  },
  web: {
    frame: "h-[400px] rounded-lg bg-bg-inverse",
    page: "top-[54px] h-[300px] w-[230px]",
    paper: "rotate-3 bg-[#edede8]",
    lines: "top-[26px] left-[29px] gap-[21px] [&>span]:h-[5px] [&>span]:bg-[#c7ccd4]",
    long: "w-40",
    short: "w-25",
    outline: "-inset-1.5 rotate-3 border-[2.5px]",
    status: "top-[360px]",
    label: "Document detected · hold steady",
  },
} as const;

const linePattern = ["short", "long", "long"] as const;

function Viewfinder({ variant }: { variant: "mobile" | "web" }) {
  const style = viewfinderStyles[variant];
  // 10 text lines on the phone page, 9 on the webcam page.
  const lines = [...linePattern, ...linePattern, ...linePattern, ...(variant === "mobile" ? (["short"] as const) : [])];

  return (
    <div
      role="img"
      aria-label="Camera preview with the summons page detected"
      className={cn("relative w-full shrink-0 overflow-hidden", style.frame)}
    >
      <div className={cn("absolute left-1/2 -translate-x-1/2", style.page)}>
        <span className={cn("absolute inset-0", style.paper)} />
        <span className={cn("absolute flex flex-col", style.lines)}>
          {lines.map((length, index) => (
            <span key={index} className={style[length]} />
          ))}
        </span>
        <span className={cn("absolute border-accent", style.outline)} />
      </div>
      <span
        className={cn(
          "absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-success-fg px-2.5 py-1.5 text-13 leading-none font-medium whitespace-nowrap text-text-inverse",
          style.status,
        )}
      >
        <Icon icon={Check} size={14} />
        {style.label}
      </span>
    </div>
  );
}
