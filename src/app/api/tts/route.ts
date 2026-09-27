import { z } from "zod";
import { synthesizeSpeech } from "@/lib/elevenlabs/tts";
import { allow, clientKey } from "@/lib/rate-limit";

const body = z.object({ text: z.string().trim().min(1).max(2500) });

/** POST { text } → MP3 of the text read aloud (the "Listen" / volume buttons). */
export async function POST(request: Request) {
  if (!allow(await clientKey("tts"), 12, 60_000)) {
    return Response.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Send some text to read." }, { status: 400 });

  try {
    const audio = await synthesizeSpeech(parsed.data.text);
    return new Response(audio, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Read aloud failed", error);
    return Response.json({ error: "Read aloud isn’t available right now." }, { status: 502 });
  }
}
