import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Check, Pencil, Upload } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DocThumb } from "@/components/tenant/scan/DocThumb";
import { FlowLayout, PageHeading } from "@/components/tenant/scan/FlowLayout";

import { buttonClassName } from "@/components/ui/Button";

export const metadata: Metadata = { title: "We couldn’t read your summons", robots: { index: false, follow: false } };

const photoTips = [
  "Lay the page flat on a dark surface",
  "Use even light and avoid glare",
  "Fit the whole first page in the frame",
];

export default function UnreadablePage() {
  return (
    <FlowLayout
      title="Scan summons"
      backHref="/"
      step={0}
      className="gap-3.5 p-5 md:gap-5 md:px-0"
      mobileFooter={
        <>
          <Link href="/scan/capture" className={buttonClassName("primary", "lg", "w-full px-4.5 text-14")}>
            <Icon icon={Camera} size={18} />
            Retake photo
          </Link>
          <Link href="/scan/review" className={buttonClassName("secondary", "lg", "w-full px-4.5 text-14")}>
            <Icon icon={Pencil} size={18} />
            Enter details manually
          </Link>
        </>
      }
    >
      <PageHeading title="We couldn’t read your summons">
        The photo is blurry or part of the page is cut off. Try again with the whole first page in view.
      </PageHeading>

      <div className="flex items-center gap-3 rounded-[10px] border border-danger-border bg-bg-surface p-3.5">
        <DocThumb faded />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
          <p className="truncate text-14 font-medium">Your summons</p>
          <p className="text-12 text-text-tertiary">The photo was deleted. Nothing was saved from it.</p>
        </div>
        <Badge tone="danger">Unreadable</Badge>
      </div>

      <section
        aria-labelledby="photo-tips"
        className="flex flex-col gap-2 rounded-[10px] border border-border-default bg-bg-app p-3.5"
      >
        <h2 id="photo-tips" className="text-13 leading-[1.45] font-semibold">
          For a better photo
        </h2>
        <ul className="flex flex-col gap-2">
          {photoTips.map((tip) => (
            <li key={tip} className="flex items-center gap-2 text-13 leading-[1.45] text-text-secondary">
              <Icon icon={Check} size={14} className="text-text-tertiary" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <div className="hidden justify-end gap-3 md:flex">
        <Link href="/scan/review" className={buttonClassName("secondary", "md", "h-11.5")}>
          <Icon icon={Pencil} size={18} />
          Enter details manually
        </Link>
        <Link href="/" className={buttonClassName("primary", "md", "h-11.5")}>
          <Icon icon={Upload} size={18} />
          Upload another file
        </Link>
      </div>
    </FlowLayout>
  );
}
