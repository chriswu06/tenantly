"use client";

import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { CircleAlert, Upload } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { UPLOAD_ACCEPT, useSummonsUpload } from "@/hooks/useSummonsUpload";

import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";

type FileUploadProps = {
  /** Show the "Upload didn't finish" state. */
  error?: { title: string; message: string };
  className?: string;
};

/**
 * Drag-and-drop summons dropzone for the web upload card. Dropping or choosing
 * a file uploads it and starts reading on /scan/extracting.
 */
export function FileUpload({ error, className }: FileUploadProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const { upload, pending } = useSummonsUpload();

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!pending) upload(event.dataTransfer.files[0]);
  }

  const input = (
    <input
      id={inputId}
      type="file"
      name="summons"
      accept={UPLOAD_ACCEPT}
      disabled={pending}
      className="sr-only"
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        upload(event.target.files?.[0]);
        event.target.value = "";
      }}
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
      aria-busy={pending || undefined}
      className={cn(
        "flex flex-col items-center gap-3 rounded-[10px] border-[1.5px] border-dashed px-6 py-9 text-center",
        error && !pending ? "border-danger-fg bg-danger-bg" : "border-border-strong bg-bg-app",
        dragging && "border-accent bg-accent-subtle",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
        className,
      )}
    >
      {pending ? (
        <>
          <span className="flex size-12 items-center justify-center rounded-3xl bg-accent-subtle text-accent">
            <Spinner size={22} />
          </span>
          <p role="status" className="flex flex-col gap-1">
            <span className="text-16 leading-[1.45] font-semibold">Uploading your summons…</span>
            <span className="text-13 leading-[1.45] text-text-secondary">This takes a few seconds.</span>
          </p>
        </>
      ) : error ? (
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
