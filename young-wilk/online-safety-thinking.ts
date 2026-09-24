export type ContactRisk = "low" | "unclear" | "high";

export interface OnlineContactScenario {
  id: string;
  title: string;
  message: string;
  signals: string[];
  risk: ContactRisk;
  safeActions: string[];
  explain: string;
}

export interface OnlineSafetyResult {
  risk: ContactRisk;
  warningSigns: string[];
  recommendedActions: string[];
  childMessage: string;
}

export const ONLINE_SAFETY_SCENARIOS: OnlineContactScenario[] = [
  {
    id: "unknown-adult-private-chat",
    title: "Nieznajomy dorosły pisze prywatnie",
    message: "Cześć, wyglądasz na fajną osobę. Nie mów rodzicom, że piszemy. Wyślij mi swoje zdjęcie.",
    signals: [
      "nieznajoma osoba dorosła",
      "prośba o sekret przed rodzicem",
      "prośba o zdjęcie",
      "próba przeniesienia rozmowy w prywatne miejsce"
    ],
    risk: "high",
    safeActions: [
      "nie wysyłaj zdjęcia ani danych",
      "nie kontynuuj rozmowy",
      "zrób zrzut ekranu, jeśli to bezpieczne",
      "zablokuj konto",
      "pokaż wiadomość rodzicowi lub zaufanemu dorosłemu"
    ],
    explain: "Dorosły, który prosi dziecko o sekret przed rodzicem albo o prywatne zdjęcia, przekracza bezpieczną granicę."
  },
  {
    id: "gaming-gift",
    title: "Ktoś oferuje darmowe rzeczy do gry",
    message: "Dam ci darmową skórkę. Wyślij login i kod, który zaraz dostaniesz.",
    signals: [
      "obietnica nagrody",
      "prośba o login lub kod",
      "presja na szybkie działanie"
    ],
    risk: "high",
    safeActions: [
      "nie podawaj hasła ani kodu",
      "nie klikaj podejrzanego linku",
      "pokaż wiadomość dorosłemu",
      "zablokuj lub zgłoś konto"
    ],
    explain: "Kody logowania i hasła są jak klucz do domu. Nie przekazuje się ich obcym."
  },
  {
    id: "location-question",
    title: "Ktoś pyta, gdzie jesteś",
    message: "W jakiej szkole jesteś? Gdzie dokładnie mieszkasz? Może kiedyś się spotkamy.",
    signals: [
      "prośba o dokładną lokalizację",
      "pytanie o szkołę lub adres",
      "propozycja spotkania"
    ],
    risk: "high",
    safeActions: [
      "nie podawaj szkoły, adresu ani dokładnej lokalizacji",
      "nie umawiaj spotkania",
      "pokaż rozmowę rodzicowi lub zaufanemu dorosłemu"
    ],
    explain: "Nieznajoma osoba nie potrzebuje dokładnego adresu, szkoły ani miejsca pobytu dziecka."
  }
];

export function assessOnlineContact(
  scenario: OnlineContactScenario
): OnlineSafetyResult {
  return {
    risk: scenario.risk,
    warningSigns: scenario.signals,
    recommendedActions: scenario.safeActions,
    childMessage:
      scenario.risk === "high"
        ? "Tu zapala się czerwone światło. Nie odpowiadaj dalej i pokaż rozmowę zaufanemu dorosłemu."
        : scenario.risk === "unclear"
          ? "Zatrzymaj się i sprawdź sytuację z zaufanym dorosłym."
          : "Na razie nie widzę dużego zagrożenia, ale nadal chroń swoje dane."
  };
}

export function onlineSafetyRulebook() {
  return [
    "Osoba, która podaje się za rówieśnika, nie musi nim naprawdę być. Wiek i tożsamość online nie są potwierdzone samą wiadomością.",
    "Nieznajomy dorosły nie powinien prosić dziecka o sekret przed rodzicem.",
    "Nie wysyłaj obcym prywatnych zdjęć, adresu, szkoły, numeru telefonu ani dokładnej lokalizacji.",
    "Hasła, kody logowania i kody jednorazowe są prywatne.",
    "Nie umawiaj spotkania z osobą poznaną online bez wiedzy i zgody rodzica/opiekuna.",
    "Gdy rozmowa robi się dziwna, zawstydzająca, sekretna albo wywołuje presję, przerwij ją i pokaż dorosłemu.",
    "Blokowanie i zgłaszanie nie jest donoszeniem. To narzędzie ochrony."
  ];
}
