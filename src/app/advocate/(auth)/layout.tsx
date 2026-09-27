import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/layout/Logo";
import { MobileInviteNote } from "@/components/advocate/auth/MobileInviteNote";

const points = [
  "Review verifications alongside the DHCD license records",
  "Track hearings and certification requests",
  "Measure how often the license defense is raised",
];

const inviteNote = "Access is by invitation from your organization.";

/**
 * Desktop: dark brand panel on the left, form centred on the right.
 * Mobile: brand header, form, and a tenant link bar at the bottom.
 */
export default function AdvocateAuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh bg-bg-surface">
      <aside className="hidden w-[600px] shrink-0 flex-col bg-bg-inverse px-16 py-12 lg:flex">
        <Logo inverse subtitle="For legal aid organizations" />
        <div className="flex flex-1 flex-col justify-center gap-5 py-12">
          <p className="text-36 font-semibold text-text-inverse">Every tenant license check, in one place.</p>
          <ul className="flex flex-col gap-5">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-15 text-border-strong">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-white/10 text-text-inverse">
                  <Icon icon={Check} size={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="flex items-center gap-2 text-13 text-text-tertiary">
          <Icon icon={Lock} size={14} />
          {inviteNote}
        </p>
      </aside>

      <div className="relative flex flex-1 flex-col">
        <header className="px-5 py-3.5 lg:hidden">
          <Logo subtitle="For legal aid organizations" />
        </header>

        <p className="absolute top-10 right-12 hidden items-center gap-1.5 text-13 lg:flex">
          <span className="text-text-tertiary">Looking for help as a tenant?</span>
          <Link href="/" className="flex items-center gap-1.5 rounded-md font-semibold text-accent">
            Go to Standing
            <Icon icon={ArrowRight} size={14} />
          </Link>
        </p>

        <main className="flex flex-1 flex-col px-5 py-4 lg:items-center lg:justify-center lg:p-12">
          <div className="w-full lg:max-w-[400px]">{children}</div>
          <MobileInviteNote note={inviteNote} />
        </main>

        <p className="flex items-center justify-center gap-1 border-t border-border-default bg-bg-app px-5 pt-3.5 pb-6.5 text-13 lg:hidden">
          <span className="text-text-tertiary">Looking for help as a tenant?</span>
          <Link href="/" className="rounded-md font-semibold text-accent">
            Go to Standing
          </Link>
        </p>
      </div>
    </div>
  );
}
