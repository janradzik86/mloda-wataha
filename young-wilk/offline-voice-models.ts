export type YoungWolfVoiceMode = "friend" | "explorer" | "teacher" | "crisis";

export type VoiceSource = "android-system" | "bundled-neural" | "network";

export interface SystemVoiceCandidate {
  id: string;
  engineId: string;
  name: string;
  locale: string;
  networkRequired: boolean;
  installed: boolean;
  quality?: number;
  latency?: number;
}

export interface OfflineVoiceCandidate {
  id: string;
  locale: "pl-PL";
  engine: "sherpa-onnx";
  family: "vits-piper";
  modelId: string;
  displayName: string;
  bundledByDefault: boolean;
  notes: string;
}

export const POLISH_OFFLINE_VOICE_CANDIDATES: OfflineVoiceCandidate[] = [
  {
    id: "pl-jarvis-medium",
    locale: "pl-PL",
    engine: "sherpa-onnx",
    family: "vits-piper",
    modelId: "vits-piper-pl_PL-jarvis_wg_glos-medium",
    displayName: "Kandydat A",
    bundledByDefault: false,
    notes: "Awaryjny lokalny głos neuronowy. Używany, gdy Android nie udostępnia odpowiedniego polskiego TTS offline."
  },
  {
    id: "pl-justyna-medium",
    locale: "pl-PL",
    engine: "sherpa-onnx",
    family: "vits-piper",
    modelId: "vits-piper-pl_PL-justyna_wg_glos-medium",
    displayName: "Kandydat B",
    bundledByDefault: false,
    notes: "Drugi kandydat awaryjny do testów A/B na urządzeniu."
  }
];

export interface YoungWolfVoiceProfile {
  id: YoungWolfVoiceMode;
  label: string;
  speed: number;
  pitchHint: number;
  sentenceMaxChars: number;
  tone: string;
}

export const YOUNG_WOLF_VOICE_PROFILES: Record<YoungWolfVoiceMode, YoungWolfVoiceProfile> = {
  friend: { id: "friend", label: "Młody Wilk", speed: 1.06, pitchHint: 1.06, sentenceMaxChars: 150, tone: "ciepły, młody, naturalny" },
  explorer: { id: "explorer", label: "Wilk Odkrywca", speed: 1.12, pitchHint: 1.07, sentenceMaxChars: 125, tone: "żywy, ciekawski, energiczny" },
  teacher: { id: "teacher", label: "Wilk Nauczyciel", speed: 0.98, pitchHint: 1.04, sentenceMaxChars: 165, tone: "spokojny, przyjazny, bardzo wyraźny" },
  crisis: { id: "crisis", label: "Wilk Kryzysowy", speed: 0.9, pitchHint: 1.0, sentenceMaxChars: 90, tone: "spokojny, krótki, jednoznaczny, bez żartów" }
};

export interface OfflineVoicePackState {
  candidateId: string;
  installed: boolean;
  verifiedOnDevice: boolean;
  selected: boolean;
}

export function chooseVoiceProfile(mode: YoungWolfVoiceMode): YoungWolfVoiceProfile {
  return YOUNG_WOLF_VOICE_PROFILES[mode];
}

export function chooseBestSystemPolishVoice(voices: SystemVoiceCandidate[]): SystemVoiceCandidate | undefined {
  return voices
    .filter(v => v.installed && !v.networkRequired && v.locale.toLowerCase().startsWith("pl"))
    .sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0) || (a.latency ?? 999) - (b.latency ?? 999))[0];
}

export function voiceNeedsDownload(state: OfflineVoicePackState | undefined) {
  return !state?.installed;
}

export function canUseOfflineNeuralVoice(state: OfflineVoicePackState | undefined) {
  return Boolean(state?.installed);
}
