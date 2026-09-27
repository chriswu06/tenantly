import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Public, indexable pages only. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/license-law", priority: 0.8 },
    { path: "/free-legal-help", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
    { path: "/accessibility", priority: 0.3 },
    { path: "/advocate/sign-in", priority: 0.2 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-09-27"),
    changeFrequency: "monthly",
    priority,
  }));
}
