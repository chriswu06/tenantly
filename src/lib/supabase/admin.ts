import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

let admin: ReturnType<typeof createClient<Database>> | undefined;

/**
 * Service-role client: bypasses row-level security. Use only on the server, and
 * only after checking the caller may act on the data (tenant case cookie, or an
 * advocate's organization).
 */
export function createAdminClient() {
  if (admin) return admin;
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY } = env();
  admin = createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
