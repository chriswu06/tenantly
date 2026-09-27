import type { Metadata } from "next";
import Link from "next/link";
import { MailQuestion } from "lucide-react";
import { SignUpForm, type Invitation } from "@/components/advocate/AuthForm";
import { AuthHeading, authSecondaryLinkClass } from "@/components/advocate/auth/AuthHeading";
import { Icon } from "@/components/ui/Icon";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Create your account" };

async function loadInvitation(token: string): Promise<Invitation | null> {
  const { data } = await createAdminClient()
    .from("invitations")
    .select("token, email, role, accepted_at, expires_at, organizations(name), advocates!invitations_invited_by_fkey(full_name)")
    .eq("token", token)
    .maybeSingle();
  if (!data || data.accepted_at || new Date(data.expires_at) < new Date() || !data.organizations) return null;
  return {
    token: data.token,
    email: data.email,
    organizationName: data.organizations.name,
    inviterName: data.advocates?.full_name ?? null,
    role: data.role,
  };
}

// Figma 26 · Advocate sign up (invitation) — mobile, 24 · desktop.
export default async function AdvocateSignUpPage({ searchParams }: PageProps<"/advocate/sign-up">) {
  const { invite: token } = await searchParams;
  const invite = typeof token === "string" && token ? await loadInvitation(token) : null;

  if (!invite) {
    return (
      <div className="flex flex-col gap-4.5">
        <span className="flex size-13 items-center justify-center rounded-full bg-accent-subtle text-accent">
          <Icon icon={MailQuestion} size={22} />
        </span>
        <AuthHeading title="You need an invitation" className="gap-1.5 [&>h1]:leading-[1.2]">
          Accounts are created from an invitation link sent by your organization. If your link has expired, ask an
          administrator on your team to send a new one.
        </AuthHeading>
        <Link href="/advocate/sign-in" className={authSecondaryLinkClass}>
          Back to sign in
        </Link>
      </div>
    );
  }
  return <SignUpForm invite={invite} />;
}
