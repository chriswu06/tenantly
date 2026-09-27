import type { Metadata } from "next";
import { SignInForm } from "@/components/advocate/AuthForm";

export const metadata: Metadata = { title: "Advocate sign in" };

// The brand panel comes from the (auth) layout.
export default async function AdvocateSignInPage({ searchParams }: PageProps<"/advocate/sign-in">) {
  const { next, error } = await searchParams;
  return <SignInForm next={typeof next === "string" ? next : undefined} linkError={error === "link"} />;
}
