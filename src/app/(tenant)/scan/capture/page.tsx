import type { Metadata } from "next";
import { CameraCapture } from "@/components/tenant/CameraCapture";
import { StartScreen } from "@/components/tenant/scan/StartScreen";

export const metadata: Metadata = { title: "Scan your summons", robots: { index: false, follow: false } };

export default function CapturePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Web: the webcam opens as a modal over the start screen. */}
      <CameraCapture backdrop={<StartScreen backdrop />} />
    </main>
  );
}
