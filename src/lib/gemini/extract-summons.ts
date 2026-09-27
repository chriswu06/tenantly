import "server-only";
import { z } from "zod";
import { env } from "@/lib/env";
import { gemini } from "./client";
import { SUMMONS_PROMPT } from "./prompts";

const confidence = z.enum(["confirmed", "needs_review", "uncertain", "missing"]);
const field = z.object({ value: z.string().nullable(), confidence });

export const summonsSchema = z.object({
  isSummons: z.boolean(),
  readable: z.boolean(),
  propertyAddress: field,
  caseNumber: field,
  landlordName: field,
  court: field,
  filingDate: field,
  hearingDate: field,
  licenseNumberOnComplaint: field,
});

export type SummonsExtraction = z.infer<typeof summonsSchema>;
export type ExtractedFieldName = Exclude<keyof SummonsExtraction, "isSummons" | "readable">;

/** Reads a summons image or PDF with Gemini and returns each field with a confidence. */
export async function extractSummons(file: { data: ArrayBuffer; mimeType: string }): Promise<SummonsExtraction> {
  const response = await gemini().models.generateContent({
    model: env().GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: file.mimeType, data: Buffer.from(file.data).toString("base64") } },
          { text: SUMMONS_PROMPT },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(summonsSchema),
      temperature: 0,
    },
  });

  const parsed = summonsSchema.safeParse(JSON.parse(response.text ?? "{}"));
  if (!parsed.success) throw new Error(`Gemini returned an unexpected shape: ${parsed.error.message}`);
  return parsed.data;
}
