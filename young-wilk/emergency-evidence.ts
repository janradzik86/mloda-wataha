export type EvidenceCaptureStatus = "idle" | "recording" | "sealed" | "uploaded" | "failed";

export interface EmergencyEvidencePolicy {
  enabled: boolean;
  maxDurationSec: number;
  requireVisibleIndicator: boolean;
  allowBackgroundCapture: boolean;
  autoUploadToPairedParent: boolean;
  retainLocalHours: number;
}

export interface EmergencyEvidenceMeta {
  id: string;
  childUserId: string;
  parentUserId?: string;
  startedAt: string;
  endedAt?: string;
  lat?: number;
  lon?: number;
  accuracyM?: number;
  mimeType: "audio/mp4" | "audio/webm" | "audio/ogg";
  sha256?: string;
  status: EvidenceCaptureStatus;
  trigger: "child_sos";
}

export function defaultEmergencyEvidencePolicy(): EmergencyEvidencePolicy {
  return {
    enabled: true,
    maxDurationSec: 180,
    requireVisibleIndicator: true,
    allowBackgroundCapture: false,
    autoUploadToPairedParent: true,
    retainLocalHours: 72
  };
}

export function emergencyEvidenceRules() {
  return [
    "Nagrywanie uruchamia wyłącznie jawna akcja SOS dziecka.",
    "Brak stałego nasłuchu i brak ukrytego bufora audio przed SOS.",
    "Podczas nagrywania aplikacja pokazuje wyraźny wskaźnik mikrofonu.",
    "Nagranie jest szyfrowane lokalnie i podpisane sumą SHA-256 po zakończeniu.",
    "Plik nie jest publiczny i trafia wyłącznie do aktywnie sparowanego rodzica/opiekuna lub pozostaje lokalnie.",
    "Metadane mogą zawierać czas i pozycję GPS, jeśli uprawnienie lokalizacji jest aktywne.",
    "Automatyczne udostępnienie policji lub innym służbom nie następuje bez świadomego działania użytkownika/opiekuna.",
    "Brak internetu nie blokuje nagrania. Upload może nastąpić później zgodnie z polityką Family Bridge.",
    "Po przekroczeniu czasu retencji lokalna kopia jest usuwana, chyba że rodzic/opiekun świadomie ją zachowa."
  ];
}
