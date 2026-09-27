"use client";

import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Upload } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/heic,application/pdf";

type FileUploadProps = {
  /** Show the "Upload didn't finish" state (frame 37). */
  error?: { title: string; message: string };
  className?: string;
};

/**
 * Drag-and-drop summons dropzone from the web upload card (frames 13 and 37).
 * No upload happens yet: a file under 10 MB moves on to extraction, a larger
 * one goes to the upload-failed screen.
 */
export function FileUpload({ error, className }: FileUploadProps) {
  const router = useRouter();
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    router.push(file.size > MAX_BYTES ? "/scan/upload-failed" : "/scan/extracting");
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  const input = (
    <input
      id={inputId}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFile(event.target.files?.[0])}
    />
  );

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center gap-3 rounded-[10px] border-[1.5px] border-dashed px-6 py-9 text-center",
        error ? "border-danger-fg bg-danger-bg" : "border-border-strong bg-bg-app",
        dragging && "border-accent bg-accent-subtle",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
        className,
      )}
    >
      {error ? (
        <>
          <span className="flex size-12 items-center justify-center rounded-3xl bg-bg-surface text-danger-fg">
            <Icon icon={CircleAlert} size={22} />
          </span>
          <p role="alert" className="flex flex-col gap-3">
            <span className="text-16 leading-[1.45] font-semibold text-danger-fg">{error.title}</span>
            <span className="text-13 leading-[1.45] text-text-primary">{error.message}</span>
          </p>
          <label htmlFor={inputId} className={buttonClassName("secondary", "compact")}>
            <Icon icon={Upload} size={16} />
            Choose another file
          </label>
          {input}
        </>
      ) : (
        <>
          <span className="flex size-12 items-center justify-center rounded-3xl bg-accent-subtle text-accent">
            <Icon icon={Upload} size={22} />
          </span>
          <p className="text-16 leading-[1.45] font-semibold">Drag a photo or PDF here</p>
          <p className="text-14 leading-[1.45] text-text-secondary">
            or{" "}
            <label htmlFor={inputId} className="cursor-pointer rounded-sm font-semibold text-accent hover:underline">
              browse files
            </label>
          </p>
          {input}
          <p className="text-12 leading-[1.45] text-text-tertiary">JPG, PNG, HEIC or PDF · up to 10 MB</p>
        </>
      )}
    </div>
  );
}
