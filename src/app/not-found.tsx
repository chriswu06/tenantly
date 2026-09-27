import Link from "next/link";
import { SearchX } from "lucide-react";
import { primaryActionClass, secondaryActionClass, StatusPage } from "@/components/layout/StatusPage";

export default function NotFound() {
  return (
    <StatusPage
      icon={SearchX}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved. You can still check your landlord's license from the start page."
    >
      <Link href="/" className={primaryActionClass}>
        Check my landlord
      </Link>
      <Link href="/how-it-works" className={secondaryActionClass}>
        How it works
      </Link>
    </StatusPage>
  );
}
