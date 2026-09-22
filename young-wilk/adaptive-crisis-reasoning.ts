export type CrisisOptionRisk = "low" | "medium" | "high";

export interface CrisisOption {
  id: string;
  label: string;
  risk: CrisisOptionRisk;
  requiresAdult: boolean;
  reversible: boolean;
  avoidsDirectContact?: boolean;
  notes?: string[];
}

export interface CrisisProblem {
  summary: string;
  constraints: string[];
  resources: string[];
  options: CrisisOption[];
}

export interface CrisisReasoningResult {
  preferredOptionIds: string[];
  rejectedOptionIds: string[];
  questionsToAsk: string[];
  reasoningRules: string[];
}

const riskRank: Record<CrisisOptionRisk, number> = { low: 1, medium: 2, high: 3 };

export function analyzeCrisisProblem(problem: CrisisProblem): CrisisReasoningResult {
  const safe = [...problem.options].sort((a,b) => {
    const risk = riskRank[a.risk] - riskRank[b.risk];
    if (risk !== 0) return risk;
    if (a.reversible !== b.reversible) return a.reversible ? -1 : 1;
    if (a.avoidsDirectContact !== b.avoidsDirectContact) return a.avoidsDirectContact ? -1 : 1;
    return Number(a.requiresAdult) - Number(b.requiresAdult);
  });

  const preferred = safe.filter(x => x.risk !== "high").slice(0, 3).map(x => x.id);
  const rejected = problem.options.filter(x => x.risk === "high").map(x => x.id);

  return {
    preferredOptionIds: preferred,
    rejectedOptionIds: rejected,
    questionsToAsk: [
      "Co naprawdę musimy osiągnąć?",
      "Co może pogorszyć sytuację?",
      "Czy da się rozwiązać problem bez bezpośredniego kontaktu?",
      "Czy rozwiązanie jest odwracalne?",
      "Czy potrzebna jest pomoc dorosłego lub specjalisty?"
    ],
    reasoningRules: [
      "Najpierw cel, potem sposób.",
      "Nie wybieraj rozwiązania tylko dlatego, że jest pierwsze.",
      "Preferuj rozwiązania niskiego ryzyka i odwracalne.",
      "Unikaj bezpośredniego kontaktu z dzikimi zwierzętami.",
      "Jeśli sytuacja dotyczy zwierzęcia, ognia, chemikaliów, leków lub konstrukcji, włącz dorosłego.",
      "Szukaj obejścia problemu zamiast siłowego działania, jeśli jest bezpieczniejsze."
    ]
  };
}

export function wildlifeProblemTemplate(): CrisisProblem {
  return {
    summary: "Dzikie zwierzę weszło do budynku lub do zapasów.",
    constraints: [
      "Nie ryzykuj ugryzienia, zadrapania ani kontaktu z odchodami.",
      "Nie niszcz budynku po ciemku tylko po to, by je złapać."
    ],
    resources: [
      "dorosły opiekun",
      "możliwość zabezpieczenia jedzenia",
      "zamykane pojemniki",
      "światło dzienne",
      "lokalny specjalista / służby, jeśli potrzebne"
    ],
    options: [
      { id:"secure_food", label:"Zabezpiecz jedzenie i usuń łatwy dostęp do zapasów", risk:"low", requiresAdult:false, reversible:true, avoidsDirectContact:true },
      { id:"wait_daylight", label:"Poczekaj do bezpieczniejszych warunków i oceń wejście zwierzęcia za dnia", risk:"low", requiresAdult:true, reversible:true, avoidsDirectContact:true },
      { id:"adult_specialist", label:"Poproś dorosłego o bezpieczne zabezpieczenie wejścia lub kontakt ze specjalistą", risk:"low", requiresAdult:true, reversible:true, avoidsDirectContact:true },
      { id:"chase", label:"Gonić zwierzę po ciemku i rozbierać elementy budynku", risk:"high", requiresAdult:true, reversible:false, avoidsDirectContact:false },
      { id:"hand_feed", label:"Próbować oswajać lub karmić dzikie zwierzę z ręki", risk:"high", requiresAdult:true, reversible:false, avoidsDirectContact:false }
    ]
  };
}
