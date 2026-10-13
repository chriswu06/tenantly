import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CircleX,
  FileDown,
  ListChecks,
  Lock,
  Scale,
  Send,
  ScanText,
  ShieldCheck,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { MobileSiteHeader } from "@/components/layout/SiteHeader";
import { LogoMark } from "@/components/layout/LogoMark";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Structured data for search engines (schema.org WebApplication).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tenantly",
  url: SITE_URL,
  applicationCategory: "LegalService",
  operatingSystem: "Any",
  description:
    "Check whether your landlord was licensed to take you to Baltimore City rent court, and get your next steps.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  areaServed: { "@type": "City", name: "Baltimore" },
};

const CHECK_HREF = "/check";

const steps: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ScanText, title: "Snap your summons", body: "Take a photo or upload a PDF. We read the details for you." },
  { icon: ShieldCheck, title: "We check the license", body: "Your landlord’s rental license, against Baltimore City records." },
  { icon: ListChecks, title: "Get your plan", body: "Your result, the proof to request, and what to bring to court." },
];

const features: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: CalendarCheck, title: "Court prep checklist", body: "Tick items off and add your hearing to your calendar." },
  { icon: Scale, title: "Free legal help", body: "Volunteer lawyers and legal aid, with verified numbers." },
  { icon: FileDown, title: "Ready-to-print PDFs", body: "A license check summary to bring to your hearing." },
  { icon: Volume2, title: "Read aloud", body: "Every page can be read to you in a natural voice." },
  { icon: Lock, title: "Private by design", body: "No account. Your summons is deleted after it’s read." },
  { icon: Send, title: "Share with legal aid", body: "Send your case to an advocate, only if you choose to." },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <MobileSiteHeader />

      <Hero />

      <section aria-labelledby="why-title" className="px-5 py-16 md:px-6 md:py-24">
        <div className="relative mx-auto grid max-w-page items-center gap-8 overflow-hidden rounded-3xl border border-white/80 bg-bg-surface/85 p-7 shadow-card backdrop-blur-sm md:grid-cols-[1fr_1.1fr] md:gap-16 md:p-12">
          <div aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-brand-blue via-brand-indigo to-brand-teal" />
          <div className="flex flex-col gap-3">
            <p className="bg-linear-to-br from-brand-blue to-brand-indigo bg-clip-text text-[72px] leading-none font-semibold tracking-[-3px] text-transparent md:text-[104px]">
              70%+
            </p>
            <p className="text-13 text-text-tertiary">
              Public Justice Center,{" "}
              <a
                href="https://abell.org/publication/justice-diverted-how-renters-are-processed-in-the-baltimore-city-rent-court/"
                className="rounded-sm underline underline-offset-2 hover:text-text-primary"
              >
                <cite>Justice Diverted</cite>
              </a>{" "}
              (2015)
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 id="why-title" className="text-24 font-semibold md:text-36">
              Most landlords’ license information doesn’t hold up.
            </h2>
            <p className="text-16 text-text-secondary md:text-18">
              In contested Baltimore City rent court cases studied, over 70% of complaints had missing or invalid
              rental license information. A landlord without an active license can’t bring a failure-to-pay-rent
              case. Most tenants never find out.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="px-5 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto flex max-w-page flex-col gap-8 md:gap-10">
          <SectionHeading id="how-title" eyebrow="How it works" title="Three steps. About two minutes." />
          <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
            {steps.map(({ icon, title, body }, index) => (
              <li
                key={title}
                className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/70 bg-bg-surface/80 p-6 shadow-card backdrop-blur-sm"
              >
                <span
                  aria-hidden
                  className="absolute -top-3 right-4 font-mono text-[88px] leading-none text-accent/8 select-none"
                >
                  {index + 1}
                </span>
                <IconBadge icon={icon} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-17 font-semibold">
                    <span className="sr-only">Step {index + 1}: </span>
                    {title}
                  </h3>
                  <p className="text-14 text-text-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="features-title"
        className="relative border-y border-accent-border/60 bg-brand-mist/80 px-5 py-16 md:px-6 md:py-24"
      >
        <div aria-hidden className="absolute inset-0 bg-grid-ink [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="relative mx-auto flex max-w-page flex-col gap-8 md:gap-10">
          <SectionHeading id="features-title" eyebrow="What you get" title="Everything you need for your hearing." />
          <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon, title, body }) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-white bg-bg-surface p-6 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand-blue to-brand-indigo text-text-inverse">
                  <Icon icon={icon} size={20} />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-15 font-semibold">{title}</h3>
                  <p className="text-14 text-text-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="px-5 py-16 md:px-6 md:py-24">
        <div className="relative mx-auto flex max-w-page flex-col items-start gap-6 overflow-hidden rounded-3xl bg-linear-to-br from-brand-blue via-brand-indigo to-brand-night p-8 text-text-inverse md:flex-row md:items-center md:justify-between md:p-12">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
          <div className="relative flex flex-col gap-2">
            <h2 id="cta-title" className="text-26 font-semibold md:text-36">
              Your hearing date is coming.
            </h2>
            <p className="text-16 text-white/75 md:text-18">Find out where you stand before you walk into court.</p>
          </div>
          <CheckButton className="relative" />
        </div>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-brand-night px-5 pt-14 pb-20 text-text-inverse md:px-6 md:pt-24 md:pb-28"
    >
      <div aria-hidden className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div aria-hidden className="absolute -top-40 -left-32 size-[520px] rounded-full bg-brand-blue/45 blur-[120px]" />
      <div aria-hidden className="absolute -right-24 -bottom-48 size-[480px] rounded-full bg-brand-teal/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-page items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-7">
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-13 text-white/80">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-teal" />
            Free for every Baltimore City tenant
          </span>
          <h1
            id="hero-title"
            className="text-[40px] leading-[1.08] font-semibold tracking-[-1.2px] md:text-[60px] md:tracking-[-2px]"
          >
            Was your landlord licensed to{" "}
            <span className="bg-linear-to-r from-brand-teal to-[#93c5fd] bg-clip-text text-transparent">
              take you to court?
            </span>
          </h1>
          <p className="max-w-[540px] text-17 leading-[1.55] text-white/75 md:text-18">
            No active rental license can mean a defense in rent court. Snap your summons and find out in about two
            minutes.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <CheckButton />
            <Link
              href="/how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-5 text-15 font-semibold text-text-inverse transition-colors hover:bg-white/10"
            >
              How it works
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-13 text-white/65">
            {["No account", "Documents deleted after reading", "Not legal advice"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Icon icon={Check} size={14} className="text-brand-teal" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ResultPreview />
      </div>
    </section>
  );
}

/** Illustration of a result screen. Decorative: the copy beside it says the same thing. */
function ResultPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[420px] lg:mr-0">
      <div className="rotate-1 rounded-2xl bg-bg-surface p-5 text-text-primary shadow-float">
        <div className="flex items-center gap-2.5 border-b border-border-default pb-4">
          <LogoMark className="size-6" />
          <span className="text-14 font-semibold">License check</span>
          <span className="ml-auto font-mono text-12 text-text-tertiary">D-01-LT-26-004821</span>
        </div>
        <div className="flex flex-col gap-3 py-4">
          <p className="text-13 text-text-tertiary">2417 E Monument St, Baltimore</p>
          <div className="flex items-center gap-3 rounded-xl border border-danger-border bg-danger-bg p-3.5">
            <Icon icon={CircleX} size={22} className="text-danger-fg" />
            <div className="flex flex-col">
              <span className="text-15 font-semibold text-danger-fg">No active rental license</span>
              <span className="text-12 text-text-secondary">You may have a defense in court</span>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-2.5 border-t border-border-default pt-4 text-13">
          {["Summons read", "Address in Baltimore City", "License records checked"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-success-bg text-success-fg">
                <Icon icon={Check} size={12} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute -right-3 -bottom-10 flex -rotate-2 items-center gap-3 rounded-xl bg-bg-surface p-3.5 pr-5 text-text-primary shadow-float md:-right-8">
        <span className="flex size-9 items-center justify-center rounded-lg bg-accent-subtle text-accent">
          <Icon icon={CalendarCheck} size={18} />
        </span>
        <span className="flex flex-col">
          <span className="text-13 font-semibold">Court prep</span>
          <span className="text-12 text-text-tertiary">3 of 5 ready</span>
        </span>
      </div>
    </div>
  );
}

function CheckButton({ className }: { className?: string }) {
  return (
    <Link
      href={CHECK_HREF}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-bg-surface px-5 text-15 font-semibold text-accent shadow-card transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      Check my landlord
      <Icon icon={ArrowRight} size={18} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-13 font-semibold tracking-[0.08em] text-accent uppercase">{eyebrow}</p>
      <h2 id={id} className="text-24 font-semibold md:text-36">
        {title}
      </h2>
    </div>
  );
}

function IconBadge({ icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-blue to-brand-indigo text-text-inverse shadow-card">
      <Icon icon={icon} size={22} />
    </span>
  );
}
