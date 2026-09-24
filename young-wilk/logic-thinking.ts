export type LogicSkill =
  | "cause_effect"
  | "compare_options"
  | "sequence"
  | "spot_assumption"
  | "resource_efficiency"
  | "prediction"
  | "evidence";

export interface LogicScenario {
  id: string;
  title: string;
  prompt: string;
  skill: LogicSkill;
  options: Array<{
    id: string;
    text: string;
    consequences: string[];
  }>;
  bestOptionId: string;
  explanation: string;
}

export interface LogicEvaluation {
  correct: boolean;
  feedback: string;
  followUp: string;
}

export const LOGIC_SCENARIOS: LogicScenario[] = [
  {
    id: "logic.schoolbag",
    title: "Co zabrać najpierw?",
    skill: "resource_efficiency",
    prompt: "Masz 5 minut do wyjścia. Plecak jest pusty. Co robisz najpierw?",
    options: [
      { id:"a", text:"Szukam dekoracji do piórnika.", consequences:["tracisz czas","nie kompletujesz najważniejszych rzeczy"] },
      { id:"b", text:"Sprawdzam plan lekcji i pakuję potrzebne książki.", consequences:["zwiększasz szansę, że masz to, czego potrzebujesz"] },
      { id:"c", text:"Przekładam wszystko z biurka do plecaka.", consequences:["zabierasz dużo niepotrzebnych rzeczy"] }
    ],
    bestOptionId: "b",
    explanation: "Najpierw określ cel i wybierz rzeczy, które naprawdę pomagają go osiągnąć."
  },
  {
    id: "logic.homework",
    title: "Nie działa pierwszy sposób",
    skill: "compare_options",
    prompt: "Nie rozumiesz zadania z matematyki po drugim przeczytaniu. Co ma największy sens?",
    options: [
      { id:"a", text:"Czytam to samo dziesięć razy dokładnie tak samo.", consequences:["możesz utknąć w tym samym sposobie"] },
      { id:"b", text:"Próbuję przykładu, rysunku albo proszę Młodego Wilka o inne wyjaśnienie.", consequences:["zmieniasz sposób dojścia do rozwiązania"] },
      { id:"c", text:"Zgaduję odpowiedź i kończę.", consequences:["nie uczysz się sposobu rozwiązania"] }
    ],
    bestOptionId: "b",
    explanation: "Jeśli jedna metoda nie działa, warto zmienić reprezentację problemu zamiast powtarzać bez końca to samo."
  },
  {
    id: "logic-rain",
    title: "Co może się wydarzyć?",
    skill: "prediction",
    prompt: "Na niebie robi się ciemno, wieje mocniej, a masz 20 minut spaceru do domu. Co warto zrobić?",
    options: [
      { id:"a", text:"Sprawdzam, co mam przy sobie i wybieram najbezpieczniejszą drogę.", consequences:["przewidujesz możliwy deszcz i ograniczasz problem"] },
      { id:"b", text:"Ignoruję wszystko, bo jeszcze nie pada.", consequences:["reagujesz dopiero po fakcie"] },
      { id:"c", text:"Biegnę na skróty przez nieznane miejsce.", consequences:["dokładasz nowe ryzyko"] }
    ],
    bestOptionId: "a",
    explanation: "Logiczne myślenie to także zauważanie sygnałów wcześniej i przygotowanie prostego planu."
  }
];

export function evaluateLogicScenario(
  scenario: LogicScenario,
  chosenOptionId: string
): LogicEvaluation {
  const chosen = scenario.options.find(x => x.id === chosenOptionId);
  if (!chosen) {
    return {
      correct: false,
      feedback: "Nie widzę takiej odpowiedzi. Wybierz jedną z dostępnych opcji.",
      followUp: "Która opcja najlepiej prowadzi do celu i robi najmniej niepotrzebnych szkód?"
    };
  }

  const correct = chosen.id === scenario.bestOptionId;
  return {
    correct,
    feedback: correct
      ? "Dobry trop. Patrzysz na cel, skutki i koszt działania."
      : "Sprawdźmy skutki tej decyzji: " + chosen.consequences.join(", ") + ".",
    followUp: "Co by się zmieniło, gdybyśmy wybrali inną drogę?"
  };
}

export function logicScenarioById(id: string) {
  return LOGIC_SCENARIOS.find(x => x.id === id);
}
