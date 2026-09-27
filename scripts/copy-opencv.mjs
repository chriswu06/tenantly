// Copies opencv.js into public/vendor so the camera screen can load it on demand
// (13 MB: too big to bundle). Runs after `npm install`, locally and on Vercel.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";

const from = "node_modules/@techstark/opencv-js/dist/opencv.js";
if (existsSync(from)) {
  mkdirSync("public/vendor", { recursive: true });
  copyFileSync(from, "public/vendor/opencv.js");
}
