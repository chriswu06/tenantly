import { AuthFormSkeleton } from "@/components/advocate/auth/AuthFormSkeleton";

/** Shown in the auth layout's form column while sign in, sign up or password reset loads. */
export default function AdvocateAuthLoading() {
  return <AuthFormSkeleton />;
}
