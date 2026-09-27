import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthHeading, authLinkClass, authSecondaryLinkClass } from "@/components/advocate/auth/AuthHeading";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Check your email" };

export default async function AdvocateResetSentPage({ searchParams }: PageProps<"/advocate/reset-password/sent">) {
  const { email } = await searchParams;
  const address = typeof email === "string" && email ? email : "your email";
  return (
    <div className="flex flex-col gap-4.5">
      <span className="flex size-13 items-center justify-center rounded-full bg-accent-subtle text-accent">
        <Icon icon={Mail} size={22} />
      </span>
      <AuthHeading title="Check your email" className="gap-1.5 [&>h1]:leading-[1.2]">
        If {address} has an account, we sent a link to reset your password. The link expires in 30
        minutes.
      </AuthHeading>
      <Link href="/advocate/sign-in" className={authSecondaryLinkClass}>
        Back to sign in
      </Link>
      <p className="flex flex-wrap justify-center gap-1 text-13 leading-[1.45]">
        <span className="text-text-secondary">Didn’t get it? Check spam or</span>
        <Link href="/advocate/reset-password" className={authLinkClass}>
          resend
        </Link>
      </p>
    </div>
  );
}
