export interface YoungWolfVoiceAdapter {
  canRecognizeOffline(): Promise<boolean>;
  listenOnce(locale?: string): Promise<string>;
  speak(text: string, locale?: string): Promise<void>;
  stopSpeaking(): Promise<void>;
}

export async function askYoungWolfByVoice(
  adapter: YoungWolfVoiceAdapter,
  onText: (text: string) => string | Promise<string>
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
  await adapter.speak(reply, "pl-PL");
  return { ok: true as const, text, reply };
}
