export type SafetyTriageRisk = "low" | "unclear" | "high" | "urgent";

export interface ChildReportedContact {
  description: string;
  claimedPeer?: boolean;
  askedForSecret?: boolean;
  askedForPhoto?: boolean;
  askedForLocation?: boolean;
  askedForMeeting?: boolean;
  askedForPasswordOrCode?: boolean;
  usedPressureOrThreat?: boolean;
  sexualContentOrRequest?: boolean;
  saysTheyAreAdult?: boolean;
}

export interface ParentSafetyAlert {
  kind: "online_safety";
  severity: "attention" | "high" | "urgent";
  title: string;
  body: string;
  signals: string[];
  includeRawMessage: false;
  requiresActiveFamilyBridge: true;
}

export interface SafetyTriageResult {
  risk: SafetyTriageRisk;
  warningSigns: string[];
  childAdvice: string[];
  shouldNotifyParent: boolean;
  parentAlert?: ParentSafetyAlert;
  note: string;
}

function hasAny(input: string, patterns: string[]) {
  const q = input.toLowerCase();
  return patterns.some(p => q.includes(p));
}

export function assessChildReportedContact(input: ChildReportedContact): SafetyTriageResult {
  const warningSigns: string[] = [];
  const q = input.description ?? "";

  if (input.claimedPeer || hasAny(q, ["mam tyle samo lat", "jestem w twoim wieku", "rówieśnik", "rowiesnik"])) {
    warningSigns.push("osoba twierdzi, że jest rówieśnikiem, ale wieku nie da się potwierdzić tylko na podstawie wiadomości");
  }
  if (input.askedForSecret || hasAny(q, ["nie mów rodzicom", "nie mow rodzicom", "to nasz sekret", "nikomu nie mów", "nikomu nie mow"])) {
    warningSigns.push("prośba o ukrywanie kontaktu przed rodzicem lub opiekunem");
  }
  if (input.askedForPhoto || hasAny(q, ["wyślij zdjęcie", "wyslij zdjecie", "pokaż zdjęcie", "pokaz zdjecie"])) {
    warningSigns.push("prośba o prywatne zdjęcie");
  }
  if (input.askedForLocation || hasAny(q, ["gdzie mieszkasz", "jaka szkoła", "jaka szkola", "wyślij lokalizację", "wyslij lokalizacje"])) {
    warningSigns.push("prośba o dokładną lokalizację, adres lub szkołę");
  }
  if (input.askedForMeeting || hasAny(q, ["spotkajmy się", "spotkajmy sie", "przyjdź sam", "przyjdz sam"])) {
    warningSigns.push("propozycja spotkania poza internetem");
  }
  if (input.askedForPasswordOrCode || hasAny(q, ["hasło", "haslo", "kod logowania", "kod sms", "kod jednorazowy"])) {
    warningSigns.push("prośba o hasło lub kod logowania");
  }
  if (input.usedPressureOrThreat || hasAny(q, ["musisz", "zaraz", "bo inaczej", "pożałujesz", "pozalujesz"])) {
    warningSigns.push("presja, pośpiech lub groźba");
  }
  if (input.sexualContentOrRequest) {
    warningSigns.push("treść seksualna lub prośba o intymny materiał");
  }
  if (input.saysTheyAreAdult) {
    warningSigns.push("osoba dorosła kontaktuje się z dzieckiem");
  }

  const urgent = Boolean(input.sexualContentOrRequest && (input.askedForMeeting || input.usedPressureOrThreat));
  const high = urgent || Boolean(
    input.askedForSecret ||
    input.askedForPhoto ||
    input.askedForLocation ||
    input.askedForMeeting ||
    input.askedForPasswordOrCode ||
    input.usedPressureOrThreat ||
    input.sexualContentOrRequest ||
    input.saysTheyAreAdult
  );

  const risk: SafetyTriageRisk = urgent ? "urgent" : high ? "high" : warningSigns.length ? "unclear" : "low";
  const shouldNotifyParent = risk === "high" || risk === "urgent";

  const childAdvice = risk === "low"
    ? ["Nie podawaj prywatnych danych i pamiętaj, że deklarowany wiek w internecie nie jest dowodem."]
    : [
        "Nie wysyłaj zdjęć, danych, haseł ani kodów.",
        "Nie umawiaj spotkania.",
        "Przerwij rozmowę, jeśli czujesz presję lub dyskomfort.",
        "Pokaż sytuację zaufanemu dorosłemu."
      ];

  const parentAlert: ParentSafetyAlert | undefined = shouldNotifyParent ? {
    kind: "online_safety",
    severity: risk === "urgent" ? "urgent" : "high",
    title: "Młody Wilk: warto zwrócić uwagę na kontakt online",
    body: "Dziecko opisało kontakt online zawierający sygnały ostrzegawcze. Sprawdź sytuację spokojnie i porozmawiaj z dzieckiem.",
    signals: warningSigns,
    includeRawMessage: false,
    requiresActiveFamilyBridge: true
  } : undefined;

  return {
    risk,
    warningSigns,
    childAdvice,
    shouldNotifyParent,
    parentAlert,
    note: "Deklarowany wiek lub tożsamość online nie potwierdzają, kim naprawdę jest rozmówca."
  };
}
