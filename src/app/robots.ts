import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

/** Public pages are indexable; the tenant's own case pages, the advocate console and APIs are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/how-it-works", "/license-law", "/free-legal-help", "/privacy", "/accessibility"],
      disallow: [
        "/advocate/",
        "/api/",
        "/auth/",
        "/scan/",
        "/verify",
        "/results",
        "/certification",
        "/court-prep",
        "/legal-help",
        "/outcome",
        "/share",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
