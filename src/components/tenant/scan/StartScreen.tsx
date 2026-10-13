import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Camera, ListChecks, Pencil, ScanText, ShieldCheck, type LucideIcon } from "lucide-react";
import { MobileSiteHeader } from "@/components/layout/SiteHeader";
import { Icon } from "@/components/ui/Icon";
import { FileUpload } from "@/components/tenant/FileUpload";
import { TrustNote } from "@/components/tenant/TrustNote";
import { SampleSummonsButton } from "@/components/tenant/SampleSummonsButton";
import { advocateHref } from "@/components/layout/nav-links";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { startManually } from "@/lib/cases/actions";
import { MobileActionBar } from "./FlowLayout";
import { buttonClassName } from "@/components/ui/Button";

const features: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ScanText, title: "We read it", body: "Address, case and dates filled in" },
  { icon: ShieldCheck, title: "We check the license", body: "Against city rental records" },
  { icon: ListChecks, title: "You get a plan", body: "What to request and bring to court" },
];

type StartScreenProps = {
  /** Mobile alert above the intro, e.g. after a failed upload. */
  mobileAlert?: ReactNode;
  /** Web dropzone error state. */
  uploadError?: { title: string; message: string };
  /** Notice above the intro on both layouts, e.g. "Your previous session ended". */
  notice?: ReactNode;
  /**
   * Render only the web layout as an inert backdrop, e.g. behind the webcam
   * modal. Its heading becomes a <p> so the modal owns the <h1>.
   */
  backdrop?: boolean;
};

/** Start screen for both layouts, including the upload-failed states. */
export function StartScreen({ mobileAlert, uploadError, notice, backdrop = false }: StartScreenProps) {
  const Heading = backdrop ? "p" : "h1";

  return (
    <>
      {!backdrop && (
        <div className="flex flex-1 flex-col md:hidden">
          <MobileSiteHeader />
          <div className="flex flex-1 flex-col gap-5 px-5 pt-6 pb-5">
            {mobileAlert}
            {notice}
            <div className="flex flex-col gap-2">
              <Heading className="text-28 font-semibold">
                Snap your summons. <GradientText>We’ll check the rest.</GradientText>
              </Heading>
              <p className="text-15 text-text-secondary">Free · About 2 minutes · No account</p>
            </div>
            <ol aria-label="How it works" className="flex flex-col gap-2.5">
              {features.map((feature, index) => (
                <FeatureTile key={feature.title} step={index + 1} {...feature} />
              ))}
            </ol>
            <SampleSummonsButton />
          </div>
          <MobileActionBar className="gap-2 bg-bg-surface/90 pb-5 backdrop-blur-md">
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
        <div className="mx-auto flex max-w-page flex-col gap-10 pt-16 pb-16 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            {!backdrop && notice}
            <div className="flex flex-col gap-4">
              <Heading className="text-40 font-semibold lg:text-[48px] lg:leading-[1.08] lg:tracking-[-1.4px]">
                Snap your summons.
                <br />
                <GradientText>We’ll check the rest.</GradientText>
              </Heading>
              <p className="text-18 text-text-secondary">Free · About 2 minutes · No account needed</p>
            </div>
            <ol aria-label="How it works" className="flex flex-col gap-3">
              {features.map((feature, index) => (
                <FeatureTile key={feature.title} step={index + 1} {...feature} />
              ))}
            </ol>
          </div>

          <UploadCard error={uploadError} />
        </div>
      </div>
    </>
  );
}

function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-linear-to-r from-brand-blue to-brand-indigo bg-clip-text text-transparent">{children}</span>
  );
}

function FeatureTile({ step, icon, title, body }: { step: number; icon: LucideIcon; title: string; body: string }) {
  return (
    <li className="flex items-center gap-3.5 rounded-xl border border-white/70 bg-bg-surface/70 p-3.5 shadow-card backdrop-blur-sm md:max-w-[480px]">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand-blue to-brand-indigo text-text-inverse">
        <Icon icon={icon} size={20} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-15 leading-[1.3] font-semibold">
          <span className="sr-only">Step {step}: </span>
          {title}
        </span>
        <span className="text-13 leading-[1.35] text-text-secondary">{body}</span>
      </span>
      <span aria-hidden className="font-mono text-13 text-text-tertiary">
        0{step}
      </span>
    </li>
  );
}

function UploadCard({ error }: { error?: StartScreenProps["uploadError"] }) {
  return (
    <section
      aria-labelledby="upload-card-title"
      className="flex w-full shrink-0 flex-col gap-5 rounded-2xl border border-border-default bg-bg-surface p-7 shadow-float lg:w-[480px]"
    >
      <div className="flex flex-col gap-1">
        <h2 id="upload-card-title" className="text-20 font-semibold">
          Upload your summons
        </h2>
        <p className="text-14 leading-[1.45] text-text-secondary">Just the first page. A photo or PDF works.</p>
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
      <SampleSummonsButton />
      <TrustNote className="leading-[1.45]" />
    </section>
  );
}
