/**
 * The site's public origin, for metadata, the sitemap and links. On Vercel it
 * falls back to the project's production domain, which Vercel sets at build time.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
