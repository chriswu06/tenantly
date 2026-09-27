import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

/*
 * Tenants have no account. Starting a check creates a case and a cookie holding
 * "<case id>.<secret>"; the database keeps only a hash of the secret. Every
 * tenant page and action reads the case through getTenantCase(), which checks
 * the secret before returning anything.
 */

export type CaseRow = Database["public"]["Tables"]["cases"]["Row"];
type CaseInsert = Database["public"]["Tables"]["cases"]["Insert"];

const COOKIE = "tenantly_case";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days: long enough to report the outcome after the hearing

function hash(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

function sameHash(a: string, b: string) {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Creates a case for this browser and sets its cookie. Call from Server Actions only. */
export async function createTenantCase(fields: Omit<CaseInsert, "access_token_hash"> = {}): Promise<CaseRow> {
  const secret = randomBytes(32).toString("base64url");
  const { data, error } = await createAdminClient()
    .from("cases")
    .insert({ ...fields, access_token_hash: hash(secret) })
    .select()
    .single();
  if (error || !data) throw new Error(`Couldn’t create the case: ${error?.message}`);

  const store = await cookies();
  store.set(COOKIE, `${data.id}.${secret}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return data;
}

/** The case this browser owns, or null. Cached per request. */
export const getTenantCase = cache(async (): Promise<CaseRow | null> => {
  const value = (await cookies()).get(COOKIE)?.value;
  const [id, secret] = value?.split(".") ?? [];
  if (!id || !secret || !/^[0-9a-f-]{36}$/.test(id)) return null;

  const { data } = await createAdminClient().from("cases").select("*").eq("id", id).maybeSingle();
  if (!data || !sameHash(data.access_token_hash, hash(secret))) return null;
  return data;
});

/** For tenant pages past the start screen: the case, or back to the start. */
export async function requireTenantCase(): Promise<CaseRow> {
  const found = await getTenantCase();
  if (!found) redirect("/?expired=1");
  return found;
}

/** Forget this browser's case (e.g. "Start over"). */
export async function clearTenantCase() {
  (await cookies()).delete(COOKIE);
}
