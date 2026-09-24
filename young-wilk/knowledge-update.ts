export type KnowledgeDomain = "law" | "first_aid" | "crisis" | "education" | "child_rights" | "online_safety";

export interface KnowledgePackManifest {
  id: string;
  domain: KnowledgeDomain;
  version: string;
  publishedAt: string;
  sourceNames: string[];
  sourceUrls: string[];
  sha256: string;
  signature: string;
  minAppVersion?: string;
  critical: boolean;
}

export interface KnowledgePackState {
  id: string;
  installedVersion?: string;
  pendingVersion?: string;
  lastCheckedAt?: string;
  lastUpdatedAt?: string;
  verified: boolean;
}

export interface KnowledgeUpdateDecision {
  action: "ignore" | "offer" | "install";
  reason: string;
}

export function canCheckForKnowledgeUpdates(params: {
  online: boolean;
  crisisMode: boolean;
  batteryPercent?: number;
}): boolean {
  if (!params.online) return false;
  if (params.crisisMode) return false;
  if (params.batteryPercent !== undefined && params.batteryPercent < 15) return false;
  return true;
}

export function decideKnowledgeUpdate(
  currentVersion: string | undefined,
  manifest: KnowledgePackManifest,
  signatureValid: boolean,
  hashValid: boolean
): KnowledgeUpdateDecision {
  if (!signatureValid || !hashValid) {
    return { action: "ignore", reason: "Pakiet nie przeszedł weryfikacji integralności lub podpisu." };
  }
  if (currentVersion === manifest.version) {
    return { action: "ignore", reason: "Ta wersja jest już zainstalowana." };
  }
  return {
    action: manifest.critical ? "install" : "offer",
    reason: manifest.critical
      ? "Zweryfikowana aktualizacja wiedzy krytycznej."
      : "Dostępna jest nowsza zweryfikowana wersja wiedzy."
  };
}

export function knowledgeUpdateRules() {
  return [
    "Młody WILK działa bez internetu także bez najnowszej aktualizacji.",
    "Internet służy do pobierania zweryfikowanych pakietów, nie do bezpośredniego uczenia się z przypadkowych stron.",
    "Pakiet musi mieć podpis, sumę kontrolną, wersję, datę i listę źródeł.",
    "Prawo i pierwsza pomoc korzystają wyłącznie z zatwierdzonych źródeł.",
    "Aktualizacja nie może usuwać ostatniej działającej wersji przed poprawnym zakończeniem instalacji.",
    "W Trybie Kryzysowym nie pobieramy aktualizacji. Używamy ostatniej zweryfikowanej lokalnej wersji."
  ];
}
