"use client";

import { loadOpenCV, type OpenCV } from "./opencv";

/*
 * Finds a sheet of paper in a photo and flattens it, like a document scanner:
 * edges (Canny) → largest four-sided outline → perspective warp. Runs in the
 * browser with OpenCV.js, so the photo never leaves the device until upload.
 */

export type Point = { x: number; y: number };
export type Corners = [Point, Point, Point, Point]; // top-left, top-right, bottom-right, bottom-left

const DETECT_MAX_SIDE = 800; // detection runs on a downscaled copy for speed
const MIN_AREA_RATIO = 0.2; // the page must fill at least 20% of the frame
const INSET = 0.01; // pull corners 1% toward the centre so no desk shows at the edges

/** US Letter, height ÷ width. Court summonses are printed on Letter paper. */
export const LETTER_ASPECT = 11 / 8.5;

/** Orders four points as top-left, top-right, bottom-right, bottom-left. */
export function orderCorners(points: Point[]): Corners {
  const bySum = [...points].sort((a, b) => a.x + a.y - (b.x + b.y));
  const byDiff = [...points].sort((a, b) => a.y - a.x - (b.y - b.x));
  return [bySum[0], byDiff[0], bySum[3], byDiff[3]];
}

function inset(corners: Corners): Corners {
  const cx = corners.reduce((sum, p) => sum + p.x, 0) / 4;
  const cy = corners.reduce((sum, p) => sum + p.y, 0) / 4;
  return corners.map((p) => ({ x: p.x + (cx - p.x) * INSET * 2, y: p.y + (cy - p.y) * INSET * 2 })) as Corners;
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Corners of the page in `source`'s pixel coordinates, or null if no page-like outline is found. */
export async function detectDocument(source: HTMLCanvasElement): Promise<Corners | null> {
  const cv = await loadOpenCV();
  const scale = Math.min(1, DETECT_MAX_SIDE / Math.max(source.width, source.height));

  const src = cv.imread(source);
  const small = new cv.Mat();
  const gray = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  try {
    cv.resize(src, small, new cv.Size(Math.round(source.width * scale), Math.round(source.height * scale)), 0, 0, cv.INTER_AREA);
    cv.cvtColor(small, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    cv.Canny(gray, edges, 50, 150);
    // Close small gaps in the page border so it forms one outline.
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    cv.dilate(edges, edges, kernel);
    kernel.delete();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const frameArea = small.rows * small.cols;
    let best: Corners | null = null;
    let bestArea = 0;
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      if (area < frameArea * MIN_AREA_RATIO || area <= bestArea) {
        contour.delete();
        continue;
      }
      const approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, 0.02 * cv.arcLength(contour, true), true);
      if (approx.rows === 4 && cv.isContourConvex(approx)) {
        const pts: Point[] = [];
        for (let j = 0; j < 4; j++) pts.push({ x: approx.data32S[j * 2] / scale, y: approx.data32S[j * 2 + 1] / scale });
        best = inset(orderCorners(pts));
        bestArea = area;
      }
      approx.delete();
      contour.delete();
    }
    return best;
  } finally {
    [src, small, gray, edges, hierarchy].forEach((m) => m.delete());
    contours.delete();
  }
}

/**
 * Warps the page inside `corners` to a flat, upright rectangle. A photo taken at
 * an angle foreshortens the page, so pass `aspect` (height ÷ width) when the
 * paper size is known; otherwise the measured edge lengths are used.
 */
export async function flattenDocument(source: HTMLCanvasElement, corners: Corners, aspect?: number): Promise<HTMLCanvasElement> {
  const cv: OpenCV = await loadOpenCV();
  const [tl, tr, br, bl] = corners;
  const width = Math.round(Math.max(distance(tl, tr), distance(bl, br)));
  const measured = Math.round(Math.max(distance(tl, bl), distance(tr, br)));
  const height = aspect ? Math.round(width * aspect) : measured;

  const src = cv.imread(source);
  const dst = new cv.Mat();
  const from = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
  const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width, 0, width, height, 0, height]);
  const transform = cv.getPerspectiveTransform(from, to);
  try {
    cv.warpPerspective(src, dst, transform, new cv.Size(width, height), cv.INTER_LINEAR, cv.BORDER_REPLICATE);
    const out = document.createElement("canvas");
    cv.imshow(out, dst);
    return out;
  } finally {
    [src, dst, from, to, transform].forEach((m) => m.delete());
  }
}

/**
 * Photo in, flattened page out (JPEG). If no page outline is found, returns the
 * photo unchanged so the upload still works.
 */
export async function scanDocument(
  image: CanvasImageSource & { width: number; height: number },
  { aspect = LETTER_ASPECT }: { aspect?: number } = {},
): Promise<{ blob: Blob; corners: Corners | null }> {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d")!.drawImage(image, 0, 0);

  const corners = await detectDocument(canvas).catch(() => null);
  const output = corners ? await flattenDocument(canvas, corners, aspect) : canvas;
  const blob = await new Promise<Blob>((resolve, reject) =>
    output.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn’t encode the photo"))), "image/jpeg", 0.9),
  );
  return { blob, corners };
}
