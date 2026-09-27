"use client";

import { useState, type ChangeEvent } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Field } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export type ExtractedValues = {
  propertyAddress: string;
  caseNumber: string;
  landlordName: string;
  filingDate: string;
  hearingDate: string;
  licenseNumber: string;
};

type ExtractedFieldsFormProps = {
  defaultValues: ExtractedValues;
  /** Extraction confidence badges, e.g. { caseNumber: "98%" }. */
  confidence: { caseNumber: string; landlordName: string };
  className?: string;
};

/**
 * Editable summons fields after extraction (frames 04 and 16). Single column
 * on mobile, paired rows on web. Values stay local until the API lands.
 */
export function ExtractedFieldsForm({ defaultValues, confidence, className }: ExtractedFieldsFormProps) {
  const [values, setValues] = useState(defaultValues);

  function bind(name: keyof ExtractedValues) {
    return {
      name,
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
    };
  }

  return (
    <div className={cn("flex flex-col gap-2.5 md:gap-4.5", className)}>
      <Field
        label="Property address"
        badge={
          <Badge tone="warn" dot>
            Verify
          </Badge>
        }
        warning="Low confidence on unit number. Confirm before continuing."
        trailingIcon={MapPin}
        autoComplete="street-address"
        {...bind("propertyAddress")}
      />
      <div className="grid gap-2.5 md:grid-cols-2 md:gap-4">
        <Field
          label="Case number"
          badge={<Badge tone="ok">{confidence.caseNumber}</Badge>}
          className="[&_input]:font-mono"
          spellCheck={false}
          {...bind("caseNumber")}
        />
        <Field
          label="Landlord (plaintiff)"
          badge={<Badge tone="ok">{confidence.landlordName}</Badge>}
          {...bind("landlordName")}
        />
      </div>
      <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
        <Field label="Filing date" trailingIcon={Calendar} inputMode="numeric" {...bind("filingDate")} />
        <Field label="Court date" trailingIcon={Calendar} {...bind("hearingDate")} />
      </div>
      <Field
        label="License number on complaint"
        badge={
          <Badge tone="neutral" dot>
            Missing
          </Badge>
        }
        placeholder="Not listed"
        hint="A missing license number can be relevant in court."
        className="[&_input]:font-mono [&_input]:placeholder:font-sans"
        spellCheck={false}
        {...bind("licenseNumber")}
      />
    </div>
  );
}

/**
 * Loading stand-in for `ExtractedFieldsForm`: the real labels, with placeholders
 * for the confidence badges, values and the messages under them.
 */
export function ExtractedFieldsFormSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-2.5 md:gap-4.5", className)}>
      <FieldSkeleton label="Property address" badgeClassName="w-[58px]" messageClassName="w-4/5 md:w-2/5" />
      <div className="grid gap-2.5 md:grid-cols-2 md:gap-4">
        <FieldSkeleton label="Case number" badgeClassName="w-[38px]" />
        <FieldSkeleton label="Landlord (plaintiff)" badgeClassName="w-[38px]" />
      </div>
      <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
        <FieldSkeleton label="Filing date" />
        <FieldSkeleton label="Court date" />
      </div>
      <FieldSkeleton label="License number on complaint" badgeClassName="w-[68px]" messageClassName="w-3/4 md:w-1/3" />
    </div>
  );
}

/** Mirrors `Field`: label row (with badge), 44px input, optional 12px message line. */
function FieldSkeleton({
  label,
  badgeClassName,
  messageClassName,
}: {
  label: string;
  badgeClassName?: string;
  messageClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-13 font-medium text-text-secondary">{label}</span>
        {badgeClassName && <Skeleton className={cn("h-[22.4px]", badgeClassName)} />}
      </div>
      <Skeleton className="h-11 rounded-lg" />
      {messageClassName && (
        <div className="flex h-[16.8px] items-center">
          <Skeleton className={cn("h-3", messageClassName)} />
        </div>
      )}
    </div>
  );
}
