export type VoiceCapability = {
  tts: boolean;
  stt: boolean;
  offlineStt: boolean;
};

export function detectVoice(): VoiceCapability {
  if (typeof window === "undefined") {
    return { tts: false, stt: false, offlineStt: false };
  }
  const tts = "speechSynthesis" in window;
  const SpeechRecognition =
    (window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ||
    (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  const stt = Boolean(SpeechRecognition);
  return { tts, stt, offlineStt: false };
}

export function speakPolish(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pl-PL";
    u.rate = 0.96;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

type Recog = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function listenPolishOnce(): Promise<{ ok: true; text: string } | { ok: false; reason: "unavailable" | "error" }> {
  if (typeof window === "undefined") return Promise.resolve({ ok: false, reason: "unavailable" });
  const Ctor =
    (window as Window & { SpeechRecognition?: new () => Recog; webkitSpeechRecognition?: new () => Recog })
      .SpeechRecognition ||
    (window as Window & { webkitSpeechRecognition?: new () => Recog }).webkitSpeechRecognition;
  if (!Ctor) return Promise.resolve({ ok: false, reason: "unavailable" });

  return new Promise((resolve) => {
    const rec = new Ctor();
    rec.lang = "pl-PL";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (ev) => {
      const text = ev.results[0]?.[0]?.transcript ?? "";
      resolve({ ok: true, text });
    };
    rec.onerror = () => resolve({ ok: false, reason: "error" });
    rec.onend = () => undefined;
    try {
      rec.start();
    } catch {
      resolve({ ok: false, reason: "unavailable" });
    }
  });
}

export const OFFLINE_STT_MESSAGE =
  "Rozpoznawanie głosu offline nie jest dostępne. Możesz nadal pisać do Młodego Wilka.";
