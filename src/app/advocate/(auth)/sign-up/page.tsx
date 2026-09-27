import type { Metadata } from "next";
import { SignUpForm } from "@/components/advocate/AuthForm";

export const metadata: Metadata = { title: "Create your account" };

// Figma 26 · Advocate sign up (invitation) — mobile, 24 · desktop.
export default function AdvocateSignUpPage() {
  return <SignUpForm />;
}
