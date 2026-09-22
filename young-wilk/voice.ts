import type { YoungWolfVoiceMode } from "./offline-voice-models";
import { chooseVoiceProfile } from "./offline-voice-models";

export interface YoungWolfVoiceAdapter {
  canRecognizeOffline(): Promise<boolean>;
  canSpeakOffline?(): Promise<boolean>;
  listenOnce(locale?: string): Promise<string>;
  speak(text: string, locale?: string, options?: { mode?: YoungWolfVoiceMode; speed?: number; pitchHint?: number }): Promise<void>;
  stopSpeaking(): Promise<void>;
}

export async function speakYoungWolf(
  adapter: YoungWolfVoiceAdapter,
  text: string,
  mode: YoungWolfVoiceMode = "friend"
) {
  const profile = chooseVoiceProfile(mode);
  const chunks = splitForSpeech(text, profile.sentenceMaxChars);

  for (const chunk of chunks) {
    await adapter.speak(chunk, "pl-PL", {
      mode,
      speed: profile.speed,
      pitchHint: profile.pitchHint
    });
  }
}

export async function askYoungWolfByVoice(
  adapter: YoungWolfVoiceAdapter,
  onText: (text: string) => string | Promise<string>,
  mode: YoungWolfVoiceMode = "friend"
) {
  const offline = await adapter.canRecognizeOffline();
  if (!offline) {
    return {
      ok: false as const,
      reason: "Rozpoznawanie głosu offline nie jest dostępne na tym urządzeniu. Młody Wilk nadal działa tekstowo."
    };
  }

  const text = await adapter.listenOnce("pl-PL");
  const reply = await onText(text);
  await speakYoungWolf(adapter, reply, mode);
  return { ok: true as const, text, reply };
}

export function splitForSpeech(text: string, maxChars = 150): string[] {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  const sentences = clean.split(/(?<=[.!?])\s+/);
  const out: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxChars) {
      current = (current + " " + sentence).trim();
      continue;
    }
    if (current) out.push(current);
    if (sentence.length <= maxChars) {
      current = sentence;
      continue;
    }
    const words = sentence.split(" ");
    let part = "";
    for (const word of words) {
      if ((part + " " + word).trim().length > maxChars && part) {
        out.push(part);
        part = word;
      } else {
        part = (part + " " + word).trim();
      }
    }
    current = part;
  }
  if (current) out.push(current);
  return out;
}
