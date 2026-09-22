export type ChildLocationMode = "off" | "while_app_open" | "background";

export interface ChildLocationConsent {
  childUserId: string;
  parentUserId: string;
  enabled: boolean;
  mode: ChildLocationMode;
  shareExactLocation: boolean;
  retentionHours: number;
  updatedAt: string;
}

export interface ChildLocationFix {
  childUserId: string;
  lat: number;
  lon: number;
  accuracyM?: number;
  recordedAt: string;
  source: "gps" | "network" | "fused";
}

export interface ParentLocationView {
  childUserId: string;
  lat: number;
  lon: number;
  accuracyM?: number;
  recordedAt: string;
  stale: boolean;
}

export function locationSharingRules() {
  return [
    "Lokalizacja jest dostępna tylko dla aktywnie sparowanego rodzica/opiekuna.",
    "Brak publicznego udostępniania dokładnej pozycji.",
    "Aplikacja dziecka wyraźnie pokazuje, że lokalizacja jest udostępniana.",
    "Tryb śledzenia w tle wymaga osobnej zgody i uprawnienia systemowego.",
    "Po wyłączeniu udostępniania nowe lokalizacje nie są wysyłane.",
    "Historia lokalizacji ma domyślnie krótki okres retencji.",
    "Brak internetu nie może powodować potajemnego późniejszego wysyłania pełnej historii bez polityki sync.",
    "SOS może wysłać bieżącą lokalizację zgodnie z regułami trybu kryzysowego."
  ];
}

export function isParentAllowedToSeeLocation(
  activeParentLink: boolean,
  consent: ChildLocationConsent | undefined
) {
  return Boolean(activeParentLink && consent?.enabled);
}

export function isLocationStale(recordedAt: string, nowMs = Date.now(), maxAgeMinutes = 10) {
  const age = nowMs - new Date(recordedAt).getTime();
  return age > maxAgeMinutes * 60 * 1000;
}
