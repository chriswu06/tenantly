"use client";

import { useState, type ChangeEvent } from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Field } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export type ExtractedValues = {
  propertyAddress: string;
  caseNumber: string;
  landlordName: string;
  /** YYYY-MM-DD */
  filingDate: string;
  /** YYYY-MM-DDTHH:mm, Baltimore time */
  hearingDate: string;
  licenseNumberOnComplaint: string;
};

export type FieldName = keyof ExtractedValues;

/** How sure the summons reading was about a value. */
export type FieldConfidence = "confirmed" | "needs_review" | "uncertain" | "missing";

type ExtractedFieldsFormProps = {
  defaultValues: ExtractedValues;
  /** Per-field confidence from the summons reading; empty when the tenant typed everything. */
  confidence?: Partial<Record<FieldName, FieldConfidence>>;
  /** Validation messages from the Server Action, keyed by field name. */
  errors?: Partial<Record<string, string[] | undefined>>;
  className?: string;
};

const confidenceBadge: Record<FieldConfidence, { tone: "ok" | "warn" | "neutral"; label: string; dot?: boolean }> = {
  confirmed: { tone: "ok", label: "Found" },
  needs_review: { tone: "warn", label: "Verify", dot: true },
  uncertain: { tone: "warn", label: "Uncertain", dot: true },
  missing: { tone: "neutral", label: "Missing", dot: true },
};

const confidenceWarning: Partial<Record<FieldConfidence, string>> = {
  needs_review: "Low confidence. Confirm this matches your summons before continuing.",
  uncertain: "We weren’t sure about this value. Check it against your summons.",
};

/**
 * Editable summons fields after extraction. Single column on mobile, paired rows
 * on web. The inputs are named for `confirmDetails`.
 */
export function ExtractedFieldsForm({ defaultValues, confidence = {}, errors = {}, className }: ExtractedFieldsFormProps) {
  const [values, setValues] = useState(defaultValues);

  function bind(name: FieldName) {
    const level = confidence[name];
    const badge = level ? confidenceBadge[level] : null;
    return {
      name,
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
      badge: badge ? (
        <Badge tone={badge.tone} dot={badge.dot}>
          {badge.label}
        </Badge>
      ) : undefined,
      warning: level ? confidenceWarning[level] : undefined,
      error: errors[name]?.[0],
    };
  }

  return (
    <div className={cn("flex flex-col gap-2.5 md:gap-4.5", className)}>
      <Field
        label="Property address"
        trailingIcon={MapPin}
        autoComplete="street-address"
        placeholder="Street, apartment, city and ZIP"
        hint="Include the apartment number, city and ZIP code."
        aria-required
        {...bind("propertyAddress")}
      />
      <div className="grid gap-2.5 md:grid-cols-2 md:gap-4">
        <Field
          label="Case number"
          className="[&_input]:font-mono [&_input]:placeholder:font-sans"
          spellCheck={false}
          autoCapitalize="characters"
          placeholder="e.g. D-01-LT-26-004821"
          aria-required
          {...bind("caseNumber")}
        />
        <Field label="Landlord (plaintiff)" aria-required {...bind("landlordName")} />
      </div>
      <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
        <Field label="Filing date" type="date" aria-required {...bind("filingDate")} />
        <Field label="Court date and time" type="datetime-local" aria-required {...bind("hearingDate")} />
      </div>
      <Field
        label="License number on complaint"
        placeholder="Not listed"
        hint="Optional. A missing license number can be relevant in court."
        className="[&_input]:font-mono [&_input]:placeholder:font-sans"
        spellCheck={false}
        {...bind("licenseNumberOnComplaint")}
      />
    </div>
  );
}

/**
 * Loading state for `ExtractedFieldsForm`: the real labels, with placeholders
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
        <FieldSkeleton label="Court date and time" />
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
