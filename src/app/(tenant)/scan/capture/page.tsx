import { MobileCameraCapture, WebcamModal } from "@/components/tenant/CameraCapture";
import { StartScreen } from "@/components/tenant/scan/StartScreen";

export default function CapturePage() {
  return (
    <main className="flex flex-1 flex-col">
      <MobileCameraCapture />
      {/* Web: the webcam opens as a modal over the start screen. */}
      <StartScreen backdrop />
      <WebcamModal />
    </main>
  );
}
