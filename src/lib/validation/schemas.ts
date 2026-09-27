import { z } from "zod";

/*
 * Input schemas shared by Server Actions. Messages are written for the person
 * filling in the form; they show under the field.
 */

export const advocateRoles = ["staff_attorney", "supervising_attorney", "paralegal", "intake_specialist"] as const;
export type AdvocateRole = (typeof advocateRoles)[number];

export const advocateRoleLabels: Record<AdvocateRole, string> = {
  staff_attorney: "Staff attorney",
  supervising_attorney: "Supervising attorney",
  paralegal: "Paralegal",
  intake_specialist: "Intake specialist",
};

const email = z.email("Enter a valid email address.").trim().toLowerCase();
const newPassword = z.string().min(12, "Use at least 12 characters.").max(128, "Use at most 128 characters.");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

export const signUpSchema = z.object({
  invite: z.string().min(1, "This sign-up link is missing its invitation. Ask your organization to resend it."),
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  role: z.enum(advocateRoles, "Choose your role."),
  password: newPassword,
  agree: z.literal("on", "You need to agree before creating your account."),
});

export const resetRequestSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "The passwords don’t match." });

export const inviteSchema = z.object({
  email,
  role: z.enum(advocateRoles, "Choose a role."),
  admin: z.literal("on").optional(),
});

/** Result shape for forms driven by useActionState. */
export type FormState = {
  /** Message for the whole form, e.g. "Wrong email or password." */
  error?: string;
  /** Per-field messages, keyed by input name. */
  fieldErrors?: Record<string, string[] | undefined>;
  /** Echo of submitted values so the form keeps them after an error. */
  values?: Record<string, string>;
  ok?: boolean;
};

export function fieldErrorsOf(error: z.ZodError): FormState["fieldErrors"] {
  return z.flattenError(error).fieldErrors as FormState["fieldErrors"];
}
