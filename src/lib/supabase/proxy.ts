import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const PUBLIC_ADVOCATE_PATHS = ["/advocate/sign-in", "/advocate/sign-up", "/advocate/reset-password"];

function isPublicAdvocatePath(pathname: string) {
  return PUBLIC_ADVOCATE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Refreshes the advocate's Supabase session cookie on every request, and keeps
 * signed-out visitors out of the console. This is an optimistic check: pages and
 * Server Actions still verify the advocate themselves (see src/lib/auth.ts).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Don't put code between createServerClient and getClaims: it refreshes the session.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/advocate") && !isPublicAdvocatePath(pathname) && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/advocate/sign-in";
    url.search = "";
    url.searchParams.set("next", pathname);
    return redirectWithCookies(url, response);
  }

  if (signedIn && (pathname === "/advocate/sign-in" || pathname === "/advocate/sign-up")) {
    const url = request.nextUrl.clone();
    url.pathname = "/advocate";
    url.search = "";
    return redirectWithCookies(url, response);
  }

  return response;
}

/** Redirect, carrying over any refreshed session cookies. */
function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
