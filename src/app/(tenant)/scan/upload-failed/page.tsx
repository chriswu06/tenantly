import type { Metadata } from "next";
import { Alert } from "@/components/ui/Alert";
import { StartScreen } from "@/components/tenant/scan/StartScreen";

export const metadata: Metadata = { title: "Upload failed", robots: { index: false, follow: false } };

const TITLE = "Upload didn’t finish";

const MESSAGES: Record<string, string> = {
  size: "Files must be 10 MB or smaller. Try a photo of the first page instead.",
  type: "That file type isn’t supported. Upload a JPG, PNG, HEIC or PDF of your summons.",
  missing: "No file came through. Choose a photo or PDF of the first page of your summons.",
  busy: "There have been too many uploads from this connection in the last hour. Try again later, or enter the details manually.",
  storage: "We couldn’t save your file just now. Try again in a moment, or enter the details manually.",
};

export default async function UploadFailedPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;
  const message = MESSAGES[reason ?? ""] ?? MESSAGES.storage;

  return (
    <main className="flex flex-1 flex-col">
      <StartScreen
        mobileAlert={
          <Alert
            tone="danger"
            title={<span className="text-14 leading-[1.45]">{TITLE}</span>}
            className="rounded-[10px] p-3.5 [&>div]:gap-[3px]"
          >
            <span className="text-13">{message}</span>
          </Alert>
        }
        uploadError={{ title: TITLE, message }}
      />
    </main>
  );
}
