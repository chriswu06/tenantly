import Link from "next/link";
import { SearchX } from "lucide-react";
import { StatusPage } from "@/components/layout/StatusPage";
import { buttonClassName } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <StatusPage
      icon={SearchX}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved. You can still check your landlord's license from the start page."
    >
      <Link href="/" className={buttonClassName("primary", "responsive")}>
        Check my landlord
      </Link>
      <Link href="/how-it-works" className={buttonClassName("secondary", "responsive")}>
        How it works
      </Link>
    </StatusPage>
  );
}
