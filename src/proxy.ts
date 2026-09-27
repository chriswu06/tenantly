import { NextResponse } from "next/server";

// Pass-through for now. In the wiring phase this refreshes the Supabase session
// and redirects signed-out visitors away from /advocate (see src/lib/supabase/proxy.ts).
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
