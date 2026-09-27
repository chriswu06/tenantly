import { Alert } from "@/components/ui/Alert";
import { StartScreen } from "@/components/tenant/scan/StartScreen";
import { oversizedFile } from "@/lib/mock/scan";

const TITLE = "Upload didn’t finish";
const MESSAGE = `${oversizedFile.name} is ${oversizedFile.size}. Files must be 10 MB or smaller. Try a photo of the first page instead.`;

export default function UploadFailedPage() {
  return (
    <main className="flex flex-1 flex-col">
      <StartScreen
        mobileAlert={
          <Alert
            tone="danger"
            title={<span className="text-14 leading-[1.45]">{TITLE}</span>}
            className="rounded-[10px] p-3.5 [&>div]:gap-[3px]"
          >
            <span className="text-13">{MESSAGE}</span>
          </Alert>
        }
        uploadError={{ title: TITLE, message: MESSAGE }}
      />
    </main>
  );
}
