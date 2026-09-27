import "server-only";
import { headers } from "next/headers";

/**
 * The site's origin for links we hand out (invites, reset emails): the request's
 * own host when there is one, so it's right on localhost, previews and production.
 */
export async function siteUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
