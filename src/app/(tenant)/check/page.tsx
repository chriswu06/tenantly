import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { StartScreen } from "@/components/tenant/scan/StartScreen";

export const metadata: Metadata = { title: "Check my landlord", alternates: { canonical: "/check" } };

export default async function StartPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <StartScreen
        notice={
          expired ? (
            <Alert tone="warn" icon={Clock} title="Your previous session ended" className="rounded-[10px] p-3.5">
              For your privacy, we couldn’t find your earlier check on this device. Start again with your summons.
            </Alert>
          ) : undefined
        }
      />
    </main>
  );
}
