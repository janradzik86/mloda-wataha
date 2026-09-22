export type SosAudioState = "idle" | "connecting" | "streaming" | "ended" | "failed";

export interface SosAudioSession {
  id: string;
  childUserId: string;
  parentUserId: string;
  startedAt: string;
  endedAt?: string;
  state: SosAudioState;
  transport: "webrtc";
  encrypted: true;
}

export interface SosAudioTransport {
  start(session: SosAudioSession): Promise<void>;
  pushAudioFrame(frame: Uint8Array, capturedAtMs: number): Promise<void>;
  stop(reason?: string): Promise<void>;
}

export function sosAudioStreamingRules() {
  return [
    "Strumień uruchamia wyłącznie jawne SOS dziecka.",
    "Mikrofon dziecka jest aktywny tylko po uruchomieniu SOS i system pokazuje jego użycie.",
    "Dźwięk jest przesyłany na żywo do aktywnie sparowanego rodzica/opiekuna.",
    "Nagranie docelowe powstaje po stronie urządzenia rodzica/opiekuna.",
    "Serwer sygnalizacyjny nie jest archiwum nagrań i nie zapisuje audio.",
    "Preferowany transport to szyfrowany WebRTC; Family Bridge autoryzuje sesję i wymienia dane sygnalizacyjne.",
    "Jeżeli rodzic jest chwilowo offline, nie uruchamiamy ukrytego wielogodzinnego bufora. SOS nadal wysyła alert i lokalizację.",
    "Dziecko widzi stan: łączenie, transmisja do opiekuna, zakończono.",
    "Tylko aktywny parent_link może odebrać strumień.",
    "ADMIN nie może podsłuchiwać ani odbierać strumienia bez relacji rodzic-dziecko."
  ];
}
