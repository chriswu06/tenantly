import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Database,
  FileText,
  Info,
  Pencil,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { MobileSiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { FileUpload } from "@/components/tenant/FileUpload";
import { TrustNote } from "@/components/tenant/TrustNote";
import { advocateHref } from "@/components/layout/nav-links";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { startManually } from "@/lib/cases/actions";
import { MobileActionBar } from "./FlowLayout";
import { buttonClassName } from "@/components/ui/Button";

const HEADLINE = "Check whether your landlord was licensed to take you to court";
const WHY_IT_MATTERS =
  "Baltimore City landlords need an active rental license to bring a failure-to-pay-rent case. Over 70% of contested complaints studied had missing or invalid license information (Public Justice Center).";

const mobileSteps: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Camera, title: "Upload or scan summons", body: "We read the address and case number." },
  { icon: Database, title: "We check city records", body: "Baltimore City DHCD rental licenses." },
  { icon: FileText, title: "Get your next steps", body: "Proof to request and what to bring to court." },
];

const webSteps: { icon: LucideIcon; label: string }[] = [
  { icon: Upload, label: "1. Upload or scan summons" },
  { icon: Database, label: "2. We check DHCD records" },
  { icon: FileText, label: "3. Get your next steps" },
];

type StartScreenProps = {
  /** Mobile alert above the intro (frame 38 · Upload failed). */
  mobileAlert?: ReactNode;
  /** Web dropzone error state (frame 37). */
  uploadError?: { title: string; message: string };
  /** Notice above the intro on both layouts, e.g. "Your previous session ended". */
  notice?: ReactNode;
  /**
   * Render only the web layout as an inert backdrop, e.g. behind the webcam
   * modal (frame 14). Its heading becomes a <p> so the modal owns the <h1>.
   */
  backdrop?: boolean;
};

/** Start screen: frames 01 (mobile) and 13 (web), plus the upload-failed variants 37/38. */
export function StartScreen({ mobileAlert, uploadError, notice, backdrop = false }: StartScreenProps) {
  const Heading = backdrop ? "p" : "h1";

  return (
    <>
      {!backdrop && (
        <div className="flex flex-1 flex-col md:hidden">
          <MobileSiteHeader />
          <div className="flex flex-1 flex-col gap-3.5 px-5 pt-4 pb-5">
            {mobileAlert}
            {notice}
            <Badge tone="accent" className="self-start">
              Baltimore City · Rent court
            </Badge>
            <div className="flex flex-col gap-1.5">
              <Heading className="text-22 font-semibold">{HEADLINE}</Heading>
              <p className="text-15 text-text-secondary">
                Scan your rent court summons. We check Baltimore City rental license records and tell you
                what to bring to court. Free, about 2 minutes.
              </p>
            </div>
            <section
              aria-labelledby="why-it-matters"
              className="flex flex-col gap-2 rounded-lg border border-accent-border bg-accent-subtle p-3.5"
            >
              <h2 id="why-it-matters" className="flex items-center gap-2 text-14 leading-[1.4] font-semibold text-accent">
                <Icon icon={Info} size={18} />
                Why this matters
              </h2>
              <p className="text-14 leading-[1.5]">{WHY_IT_MATTERS}</p>
            </section>
            <ol aria-label="How it works" className="flex flex-col rounded-lg border border-border-default bg-bg-surface">
              {mobileSteps.map(({ icon, title, body }) => (
                <li
                  key={title}
                  className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 last:border-b-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-text-secondary">
                    <Icon icon={icon} size={18} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-15 leading-[1.3] font-semibold">{title}</span>
                    <span className="text-13 leading-[1.35] text-text-secondary">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <MobileActionBar className="gap-2 pb-5">
            <Link href="/scan/capture" className={buttonClassName("primary", "lg", "w-full")}>
              <Icon icon={Camera} size={18} />
              Scan summons
            </Link>
            <form action={startManually} className="contents">
              <SubmitButton icon={<Icon icon={Pencil} size={18} />} className={buttonClassName("secondary", "lg", "w-full")}>
                Enter details manually
              </SubmitButton>
            </form>
            <TrustNote />
            <Link
              href={advocateHref}
              className="flex items-center justify-center gap-1.5 self-center rounded-md text-13 font-semibold text-accent"
            >
              For legal aid organizations
              <Icon icon={ArrowRight} size={14} />
            </Link>
          </MobileActionBar>
        </div>
      )}

      <div
        className="hidden flex-1 md:block md:px-6"
        inert={backdrop || undefined}
        aria-hidden={backdrop || undefined}
      >
        <div className="mx-auto flex max-w-page flex-col gap-10 pt-18 pb-12 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {!backdrop && notice}
            <Badge tone="accent" className="self-start px-2.5 py-1 text-13">
              Baltimore City · Rent court
            </Badge>
            <Heading className="text-40 font-semibold">{HEADLINE}</Heading>
            <p className="text-18 text-text-secondary">
              Upload your rent court summons. We check Baltimore City rental license records and tell you what
              to bring to court. Free, about 2 minutes.
            </p>
            <div className="flex items-start gap-3 rounded-lg border border-border-default bg-bg-surface p-4">
              <Icon icon={Info} size={20} className="text-accent" />
              <p className="min-w-0 flex-1 text-14 leading-[1.55] text-text-secondary">{WHY_IT_MATTERS}</p>
            </div>
            <ol aria-label="How it works" className="flex items-start gap-6">
              {webSteps.map(({ icon, label }) => (
                <li key={label} className="flex min-w-0 flex-1 flex-col gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-primary">
                    <Icon icon={icon} size={20} />
                  </span>
                  <span className="text-14 leading-[1.35] font-medium">{label}</span>
                </li>
              ))}
            </ol>
          </div>

          <UploadCard error={uploadError} />
        </div>
      </div>
    </>
  );
}

function UploadCard({ error }: { error?: StartScreenProps["uploadError"] }) {
  return (
    <section
      aria-labelledby="upload-card-title"
      className="flex w-full shrink-0 flex-col gap-5 rounded-xl border border-border-default bg-bg-surface p-7 shadow-card lg:w-[500px]"
    >
      <div className="flex flex-col gap-1">
        <h2 id="upload-card-title" className="text-20 font-semibold">
          Upload your summons
        </h2>
        <p className="text-14 leading-[1.45] text-text-secondary">
          The first page with the address and case number is enough.
        </p>
      </div>
      <FileUpload error={error} />
      <div className="flex items-center gap-3 text-12 leading-[1.45] text-text-tertiary">
        <span aria-hidden className="h-px flex-1 bg-border-default" />
        or
        <span aria-hidden className="h-px flex-1 bg-border-default" />
      </div>
      <Link href="/scan/capture" className={buttonClassName("secondary", "md", "w-full px-4")}>
        <Icon icon={Camera} size={18} />
        Use webcam
      </Link>
      <form action={startManually} className="flex justify-center">
        <SubmitButton
          icon={<Icon icon={Pencil} size={16} />}
          iconSize={16}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-14 leading-[1.45] font-semibold text-accent hover:underline"
        >
          Enter details manually instead
        </SubmitButton>
      </form>
      <TrustNote className="leading-[1.45]" />
    </section>
  );
}
