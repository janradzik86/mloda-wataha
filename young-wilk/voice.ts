import type { SystemVoiceCandidate, YoungWolfVoiceMode } from "./offline-voice-models";
import { chooseBestSystemPolishVoice, chooseVoiceProfile } from "./offline-voice-models";

export interface YoungWolfVoiceAdapter {
  canRecognizeOffline(): Promise<boolean>;
  canSpeakOffline?(): Promise<boolean>;
  listSystemVoices?(): Promise<SystemVoiceCandidate[]>;
  selectSystemVoice?(voiceId: string): Promise<void>;
  requestInstallVoiceData?(): Promise<void>;
  listenOnce(locale?: string): Promise<string>;
  speak(text: string, locale?: string, options?: { mode?: YoungWolfVoiceMode; speed?: number; pitchHint?: number }): Promise<void>;
  stopSpeaking(): Promise<void>;
}

export interface VoiceBootstrapResult {
  source: "android-system" | "adapter-default";
  voice?: SystemVoiceCandidate;
  offlineReady: boolean;
}

export async function bootstrapYoungWolfVoice(adapter: YoungWolfVoiceAdapter): Promise<VoiceBootstrapResult> {
  if (adapter.listSystemVoices && adapter.selectSystemVoice) {
    const voices = await adapter.listSystemVoices();
    const selected = chooseBestSystemPolishVoice(voices);
    if (selected) {
      await adapter.selectSystemVoice(selected.id);
      return { source: "android-system", voice: selected, offlineReady: true };
    }
  }

  const offlineReady = (await adapter.canSpeakOffline?.()) ?? false;
  if (!offlineReady && adapter.requestInstallVoiceData) {
    await adapter.requestInstallVoiceData();
  }
  return { source: "adapter-default", offlineReady };
}

export async function speakYoungWolf(adapter: YoungWolfVoiceAdapter, text: string, mode: YoungWolfVoiceMode = "friend") {
  const profile = chooseVoiceProfile(mode);
  const chunks = splitForSpeech(text, profile.sentenceMaxChars);
  for (const chunk of chunks) {
    await adapter.speak(chunk, "pl-PL", { mode, speed: profile.speed, pitchHint: profile.pitchHint });
  }
}

export async function askYoungWolfByVoice(
  adapter: YoungWolfVoiceAdapter,
  onText: (text: string) => string | Promise<string>,
  mode: YoungWolfVoiceMode = "friend"
) {
  const offline = await adapter.canRecognizeOffline();
  if (!offline) return { ok: false as const, reason: "Rozpoznawanie głosu offline nie jest dostępne. Młody Wilk nadal działa tekstowo." };
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
    if (sentence.length <= maxChars) { current = sentence; continue; }
    const words = sentence.split(" ");
    let part = "";
    for (const word of words) {
      if ((part + " " + word).trim().length > maxChars && part) { out.push(part); part = word; }
      else part = (part + " " + word).trim();
    }
    current = part;
  }
  if (current) out.push(current);
  return out;
}
