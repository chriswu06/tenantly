import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { StartScreen } from "@/components/tenant/scan/StartScreen";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const siteUrl = SITE_URL;

// Structured data for search engines (schema.org WebApplication).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tenantly",
  url: siteUrl,
  applicationCategory: "LegalService",
  operatingSystem: "Any",
  description:
    "Check whether your landlord was licensed to take you to Baltimore City rent court, and get your next steps.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  areaServed: { "@type": "City", name: "Baltimore" },
};

export default async function StartPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
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
