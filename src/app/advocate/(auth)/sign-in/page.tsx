import type { Metadata } from "next";
import { SignInForm } from "@/components/advocate/AuthForm";

export const metadata: Metadata = { title: "Advocate sign in" };

// Figma 25 · Advocate sign in — mobile, 23 · desktop. The brand panel comes from the (auth) layout.
export default function AdvocateSignInPage() {
  return <SignInForm />;
}
