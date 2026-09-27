import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/advocate/AuthForm";

export const metadata: Metadata = { title: "Choose a new password" };

// Reached from the reset email (via /auth/callback, which signs the advocate in). No Figma frame.
export default function AdvocateUpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
