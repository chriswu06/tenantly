import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/advocate/AuthForm";

export const metadata: Metadata = { title: "Reset your password" };

export default function AdvocateResetPasswordPage() {
  return <ResetPasswordForm />;
}
