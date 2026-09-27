import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Check whether your landlord was licensed to take you to Baltimore City rent court, and get your next steps. Free, about 2 minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Standing · Check your landlord’s rental license",
    template: "%s · Standing",
  },
  description,
  applicationName: "Standing",
  keywords: ["Baltimore", "rent court", "rental license", "tenant", "failure to pay rent", "DHCD", "eviction defense"],
  icons: { icon: "/logo.svg" },
  openGraph: {
    type: "website",
    siteName: "Standing",
    locale: "en_US",
    title: "Standing · Check your landlord’s rental license",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "Standing · Check your landlord’s rental license", description },
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
