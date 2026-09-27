import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/advocate/AuthForm";

export const metadata: Metadata = { title: "Reset your password" };

// Figma 56 · Advocate reset password — mobile, 54 · desktop.
export default function AdvocateResetPasswordPage() {
  return <ResetPasswordForm />;
}
