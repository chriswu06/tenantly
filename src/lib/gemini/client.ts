import "server-only";
import { GoogleGenAI } from "@google/genai";
import { requireEnv } from "@/lib/env";

let client: GoogleGenAI | undefined;

export function gemini() {
  client ??= new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") });
  return client;
}
