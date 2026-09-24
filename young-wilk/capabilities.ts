import type { AgeBand, TutorReply } from "./types";

export interface CapabilityItem {
  id: string;
  label: string;
  childDescription: string;
  examples: string[];
}

export const YOUNG_WOLF_CAPABILITIES: CapabilityItem[] = [
  {
    id: "ask",
    label: "Zapytaj Młodego WILKA",
    childDescription: "Możesz pytać normalnymi słowami. Nie musisz znać komend ani specjalnych przycisków.",
    examples: ["Wytłumacz mi ułamki", "Dlaczego jest burza?", "Nie rozumiem tego zadania"]
  },
  {
    id: "school",
    label: "Pomoc w nauce",
    childDescription: "Pomagam z lekcjami, robię małe powtórki i zmieniam sposób tłumaczenia, jeśli coś nie działa.",
    examples: ["Mieliśmy dziś procenty i nie kumam", "Pokaż mi to na przykładzie", "Sprawdź, czy już rozumiem"]
  },
  {
    id: "games",
    label: "Nauka przez gry i misje",
    childDescription: "Mogę zamienić temat w prostą misję albo bezpieczną grę, żeby łatwiej było go przećwiczyć.",
    examples: ["Zrób z tego grę", "Naucz mnie tego jak misji"]
  },
  {
    id: "logic",
    label: "Myślenie i rozwiązywanie problemów",
    childDescription: "Ćwiczymy przewidywanie skutków, wybieranie lepszych rozwiązań i oszczędzanie czasu oraz zasobów.",
    examples: ["Co będzie lepszym rozwiązaniem?", "Co może się stać potem?"]
  },
  {
    id: "safety",
    label: "Bezpieczeństwo",
    childDescription: "Pomagam rozpoznać niebezpieczne sytuacje w internecie i w prawdziwym świecie oraz podpowiadam bezpieczne kroki.",
    examples: ["Ktoś w internecie prosi mnie o zdjęcie", "Co zrobić, gdy się zgubię?"]
  },
  {
    id: "crisis",
    label: "Tryb kryzysowy i SOS",
    childDescription: "W nagłej sytuacji przechodzę na krótkie, spokojne instrukcje. Pomagam znaleźć najważniejszy następny krok i kontakt z dorosłym.",
    examples: ["Potrzebuję pomocy", "Zgubiłem się", "Jest niebezpiecznie"]
  },
  {
    id: "rights",
    label: "Prawa dziecka i obywatela",
    childDescription: "Mogę tłumaczyć prawa dziecka, prawa człowieka i podstawowe zasady działania urzędów prostym językiem.",
    examples: ["Jakie mam prawa?", "Co znaczy prawo do prywatności?"]
  },
  {
    id: "map",
    label: "Mapa i orientacja",
    childDescription: "Mogę pomagać w korzystaniu z mapy, pozycji i bezpiecznej nawigacji, także gdy aplikacja ma zapisane dane offline.",
    examples: ["Gdzie jestem?", "Jak wrócić do bezpiecznego miejsca?"]
  },
  {
    id: "family",
    label: "Rodzic i Family Bridge",
    childDescription: "Aplikacja może współpracować ze sparowanym rodzicem lub opiekunem przy zgodach, ważnych zgłoszeniach i bezpieczeństwie.",
    examples: ["Pokaż rodzicowi", "Chcę poprosić rodzica o zgodę"]
  },
  {
    id: "den",
    label: "Nora i nagrody",
    childDescription: "W Norze znajdziesz swoje rzeczy, postępy i nagrody. Nagroda ma być za realne opanowanie tematu, a nie za ściganie się z innymi.",
    examples: ["Pokaż moje nagrody", "Co mam w Norze?"]
  }
];

export function isCapabilitiesQuestion(text: string): boolean {
  const q = normalize(text);
  return [
    "co potrafisz",
    "co umiesz",
    "w czym mozesz pomoc",
    "w czym możesz pomóc",
    "jak dziala ta aplikacja",
    "jak działa ta aplikacja",
    "jak korzystac z aplikacji",
    "jak korzystać z aplikacji",
    "co tu moge robic",
    "co tu mogę robić",
    "jak sie tu odnalezc",
    "jak się tu odnaleźć",
    "pokaz funkcje",
    "pokaż funkcje"
  ].some(x => q.includes(normalize(x)));
}

export function capabilitiesReply(ageBand: AgeBand): TutorReply {
  const intro = ageBand === "7-9"
    ? "Jasne 🐺 Jestem Młody WILK. Możesz po prostu do mnie mówić albo pisać. Nie musisz pamiętać żadnych komend."
    : "Jasne 🐺 Jestem Młody WILK. Możesz rozmawiać ze mną normalnie, bez uczenia się komend i przeklikiwania trybów.";

  const body = YOUNG_WOLF_CAPABILITIES
    .map(x => `• ${x.label}: ${x.childDescription}`)
    .join("\n");

  const ending = ageBand === "7-9"
    ? "Jeśli nie wiesz, gdzie coś jest, napisz po prostu: „gdzie znajdę…?” albo „pomóż mi zrobić…”."
    : "Jeśli nie wiesz, gdzie wejść albo jak uruchomić funkcję, napisz po prostu, czego chcesz. Powiem, gdzie to znaleźć albo przeprowadzę Cię krok po kroku.";

  return {
    text: `${intro}\n\n${body}\n\n${ending}`,
    style: "simple",
    ageBand,
    suggestedNext: "practice"
  };
}

function normalize(s: string) {
  return s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .trim();
}
