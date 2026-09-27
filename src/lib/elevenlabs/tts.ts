import "server-only";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { env, requireEnv } from "@/lib/env";

let client: ElevenLabsClient | undefined;

/** Speaks `text` with the configured voice; returns an MP3 stream. */
export async function synthesizeSpeech(text: string) {
  client ??= new ElevenLabsClient({ apiKey: requireEnv("ELEVENLABS_API_KEY") });
  return client.textToSpeech.stream(env().ELEVENLABS_VOICE_ID, {
    text,
    modelId: "eleven_flash_v2_5",
    outputFormat: "mp3_44100_64",
  });
}
