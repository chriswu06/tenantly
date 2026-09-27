"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  ExtractedFieldsForm,
  type ExtractedValues,
  type FieldConfidence,
  type FieldName,
} from "@/components/tenant/ExtractedFieldsForm";
import { SubmitButton } from "@/components/tenant/SubmitButton";
import { SummonsPreview } from "@/components/tenant/SummonsPreview";
import { confirmDetails } from "@/lib/cases/actions";
import type { FormState } from "@/lib/validation/schemas";
import { FlowLayout, PageHeading } from "./FlowLayout";

type ReviewScreenProps = {
  values: ExtractedValues;
  confidence: Partial<Record<FieldName, FieldConfidence>>;
  /** read: fields came from the summons. unavailable: an upload that couldn't be read. manual: typed from scratch. */
  source: "read" | "unavailable" | "manual";
};

const FORM_ID = "review-form";

/** Confirm the summons fields, then check the address. */
export function ReviewScreen({ values, confidence, source }: ReviewScreenProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(confirmDetails, {});
  const formRef = useRef<HTMLFormElement>(null);
  const fieldErrorCount = Object.values(state.fieldErrors ?? {}).filter((messages) => messages?.length).length;

  // After a failed submit, move focus to the first field that needs fixing.
  useEffect(() => {
    if (!fieldErrorCount) return;
    formRef.current?.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus();
  }, [state, fieldErrorCount]);

  const submitLabel = pending ? "Checking address…" : "Verify license";
  const showPreview = source !== "manual";

  return (
    <FlowLayout
      title="Review details"
      backHref="/"
      step={1}
      width="wide"
      className="gap-2.5 p-5 md:gap-8 md:px-0 lg:flex-row lg:items-start"
      mobileFooter={
        <SubmitButton
          form={FORM_ID}
          pending={pending}
          trailingIcon={<Icon icon={ArrowRight} size={18} />}
          className={buttonClassName("primary", "lg", "w-full")}
        >
          {submitLabel}
        </SubmitButton>
      }
    >
      <div className="contents md:flex md:flex-col md:gap-4.5 lg:order-2 lg:min-w-0 lg:flex-1">
        {source === "read" ? (
          <PageHeading title="Review extracted details">
            Compare each value with your summons and correct anything that doesn’t match.
          </PageHeading>
        ) : (
          <PageHeading title="Enter your summons details">
            Type them as they appear on your summons. We use the address to check city license records.
          </PageHeading>
        )}
        {source === "unavailable" && (
          <Alert tone="warn" title="We couldn’t read your summons automatically.">
            Enter the details from your summons.
          </Alert>
        )}
        {showPreview && <SummonsPreview className="md:hidden" />}

        <form ref={formRef} id={FORM_ID} action={formAction} noValidate className="flex flex-col gap-2.5 md:gap-4.5">
          <div className="empty:hidden">
            {state.error ? (
              <Alert tone="danger" title="Something went wrong">
                {state.error}
              </Alert>
            ) : fieldErrorCount ? (
              <Alert tone="danger" title={fieldErrorCount === 1 ? "Check 1 field" : `Check ${fieldErrorCount} fields`}>
                Fix the highlighted {fieldErrorCount === 1 ? "field" : "fields"}, then try again.
              </Alert>
            ) : null}
          </div>

          <ExtractedFieldsForm defaultValues={values} confidence={confidence} errors={state.fieldErrors} />

          <div className="hidden justify-end gap-3 pt-2 md:flex">
            <Link href="/" className={buttonClassName("secondary", "md")}>
              Back
            </Link>
            <SubmitButton pending={pending} trailingIcon={<Icon icon={ArrowRight} size={18} />} className={buttonClassName("primary", "md")}>
              {submitLabel}
            </SubmitButton>
          </div>
        </form>
      </div>
      {showPreview && <SummonsPreview className="hidden md:flex lg:order-1 lg:w-[360px] lg:shrink-0" />}
    </FlowLayout>
  );
}
