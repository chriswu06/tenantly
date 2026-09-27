import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = SITE_URL;
const description =
  "Check whether your landlord was licensed to take you to Baltimore City rent court, and get your next steps. Free, about 2 minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tenantly · Check your landlord’s rental license",
    template: "%s · Tenantly",
  },
  description,
  applicationName: "Tenantly",
  keywords: ["Baltimore", "rent court", "rental license", "tenant", "failure to pay rent", "DHCD", "eviction defense"],
  icons: { icon: "/logo.svg" },
  openGraph: {
    type: "website",
    siteName: "Tenantly",
    locale: "en_US",
    title: "Tenantly · Check your landlord’s rental license",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "Tenantly · Check your landlord’s rental license", description },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
