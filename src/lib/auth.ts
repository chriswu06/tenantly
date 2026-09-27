import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CurrentAdvocate = {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  role: "staff_attorney" | "supervising_attorney" | "paralegal" | "intake_specialist";
  isAdmin: boolean;
  notify: { shared: boolean; hearing: boolean; lookup: boolean };
  organization: { id: string; slug: string; name: string; callbackPhone: string | null; languages: string | null };
};

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts.at(-1)![0] : "")).toUpperCase();
}

/**
 * The signed-in advocate and their organization, or null. Verifies the session
 * token (getClaims) rather than trusting the cookie. Cached per request.
 */
export const getAdvocate = cache(async (): Promise<CurrentAdvocate | null> => {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return null;

  const { data } = await supabase
    .from("advocates")
    .select("id, full_name, email, role, is_admin, notify_shared, notify_hearing, notify_lookup, organizations(id, slug, name, callback_phone, languages)")
    .eq("id", userId)
    .maybeSingle();
  if (!data || !data.organizations) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    initials: initialsOf(data.full_name),
    email: data.email,
    role: data.role,
    isAdmin: data.is_admin,
    notify: { shared: data.notify_shared, hearing: data.notify_hearing, lookup: data.notify_lookup },
    organization: {
      id: data.organizations.id,
      slug: data.organizations.slug,
      name: data.organizations.name,
      callbackPhone: data.organizations.callback_phone,
      languages: data.organizations.languages,
    },
  };
});

/** For console pages and actions: the advocate, or a redirect to sign in. */
export async function requireAdvocate(): Promise<CurrentAdvocate> {
  const advocate = await getAdvocate();
  if (!advocate) redirect("/advocate/sign-in");
  return advocate;
}
