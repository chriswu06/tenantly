"use client";

import { useCallback, useTransition } from "react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { startWithUpload } from "@/lib/cases/actions";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const UPLOAD_ACCEPT = "image/jpeg,image/png,image/heic,image/heif,image/webp,application/pdf";
const UPLOAD_TYPES = UPLOAD_ACCEPT.split(",");

// Photos are flattened and downscaled in the browser before upload: a phone
// photo is often 3–6 MB, and 2200px is plenty for reading the summons.
const MAX_EDGE = 2200;

/**
 * Finds the page in a photo with OpenCV and flattens it (see
 * src/lib/vision/document-scanner.ts), then re-encodes it as JPEG. PDFs and
 * formats the browser can't decode (HEIC on most browsers) upload unchanged, and
 * any failure falls back to the original file.
 */
async function prepareImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const { scanDocument } = await import("@/lib/vision/document-scanner");
    const { blob } = await scanDocument(canvas);
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/**
 * Sends a summons photo or PDF to `startWithUpload`, which creates the case and
 * redirects to /scan/extracting (or /scan/upload-failed). Files over 10 MB or of
 * the wrong type never leave the browser.
 */
export function useSummonsUpload() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const upload = useCallback(
    (file: File | Blob | undefined | null, name = "summons.jpg") => {
      if (!file) return;
      const asFile = file instanceof File ? file : new File([file], name, { type: file.type || "image/jpeg" });
      if (asFile.size > MAX_UPLOAD_BYTES) {
        router.push("/scan/upload-failed?reason=size");
        return;
      }
      if (asFile.type && !UPLOAD_TYPES.includes(asFile.type)) {
        router.push("/scan/upload-failed?reason=type");
        return;
      }
      startTransition(async () => {
        const formData = new FormData();
        formData.set("summons", await prepareImage(asFile));
        try {
          await startWithUpload(formData);
        } catch (error) {
          // The action ends with redirect(), which reaches here as an error: let Next handle it.
          unstable_rethrow(error);
          console.error("Upload failed", error);
          router.push("/scan/upload-failed?reason=storage");
        }
      });
    },
    [router],
  );

  return { upload, pending };
}
