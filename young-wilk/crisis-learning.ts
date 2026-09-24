export type SupplyKind = "food" | "water" | "medicine" | "battery" | "other";

export interface SupplyEntry {
  id: string;
  name: string;
  kind: SupplyKind;
  amount: number;
  unit: string;
  note?: string;
}

export interface CrisisHouseholdPlan {
  people: number;
  supplies: SupplyEntry[];
}

export interface ConsumptionPlanInput {
  supplyId: string;
  plannedDailyAmountPerPerson: number;
}

export interface SupplyForecast {
  supplyId: string;
  name: string;
  totalAmount: number;
  unit: string;
  people: number;
  plannedDailyAmountPerPerson: number;
  plannedDailyHouseholdAmount: number;
  estimatedDays: number | null;
  warning?: string;
}

export interface CrisisNotebookEntry {
  at: string;
  title: string;
  description: string;
  category: "supplies" | "events" | "tasks" | "learning";
}

export interface CrisisLearningTask {
  subject: "math" | "polish" | "planning";
  title: string;
  prompt: string;
  adultSupervisionRequired: boolean;
}

function validPositive(n: number) {
  return Number.isFinite(n) && n > 0;
}

export function forecastSupply(
  plan: CrisisHouseholdPlan,
  input: ConsumptionPlanInput
): SupplyForecast {
  const item = plan.supplies.find(x => x.id === input.supplyId);
  if (!item) throw new Error("Unknown supply");
  if (!Number.isInteger(plan.people) || plan.people < 1) throw new Error("People must be >= 1");

  const dailyPerPerson = input.plannedDailyAmountPerPerson;
  if (!validPositive(dailyPerPerson)) {
    return {
      supplyId: item.id,
      name: item.name,
      totalAmount: item.amount,
      unit: item.unit,
      people: plan.people,
      plannedDailyAmountPerPerson: 0,
      plannedDailyHouseholdAmount: 0,
      estimatedDays: null,
      warning: "Najpierw dorosły musi podać planowane dzienne zużycie na osobę."
    };
  }

  const dailyHousehold = dailyPerPerson * plan.people;
  const days = validPositive(item.amount) ? item.amount / dailyHousehold : 0;

  const warning = item.kind === "water" || item.kind === "medicine"
    ? "To jest ćwiczenie matematyczne na podstawie podanych wartości. Dziecko nie ustala samodzielnie racji wody ani leków. Ilości i decyzje należą do dorosłego lub oficjalnych zaleceń."
    : "To jest prognoza na podstawie wpisanego planu zużycia, nie automatyczna decyzja o racjonowaniu.";

  return {
    supplyId: item.id,
    name: item.name,
    totalAmount: item.amount,
    unit: item.unit,
    people: plan.people,
    plannedDailyAmountPerPerson: dailyPerPerson,
    plannedDailyHouseholdAmount: dailyHousehold,
    estimatedDays: Number.isFinite(days) ? Math.max(0, days) : null,
    warning
  };
}

export function makeCrisisLearningTasks(
  plan: CrisisHouseholdPlan,
  forecasts: SupplyForecast[]
): CrisisLearningTask[] {
  const supplyNames = plan.supplies.map(x => x.name).join(", ") || "zapasy";

  return [
    {
      subject: "math",
      title: "Policz zapasy",
      prompt: `Sprawdź liczby razem z dorosłym. W domu jest ${plan.people} osób. Dla wybranego produktu policz dzienne zużycie całej grupy i oszacuj, na ile dni wystarczy według planu podanego przez dorosłego.`,
      adultSupervisionRequired: true
    },
    {
      subject: "polish",
      title: "Dziennik zapasów",
      prompt: `Zapisz czytelnie w notesie: data, nazwa rzeczy, ilość, jednostka i krótki opis. Aktualna lista: ${supplyNames}.`,
      adultSupervisionRequired: false
    },
    {
      subject: "planning",
      title: "Co trzeba sprawdzić później?",
      prompt: "Wybierz jedną rzecz, której stan trzeba sprawdzić ponownie później. Zapisz kiedy i dlaczego. Nie podejmuj samodzielnie decyzji medycznych ani o ograniczaniu wody.",
      adultSupervisionRequired: true
    }
  ];
}

export function addNotebookEntry(
  entries: CrisisNotebookEntry[],
  entry: Omit<CrisisNotebookEntry, "at">,
  now = new Date()
): CrisisNotebookEntry[] {
  const clean = {
    ...entry,
    title: entry.title.trim().slice(0, 120),
    description: entry.description.trim().slice(0, 1000),
    at: now.toISOString()
  };
  return [...entries, clean].slice(-200);
}

export function crisisLearningIntro(childName?: string) {
  const hello = childName ? `${childName}, ` : "";
  return hello + "w trybie kryzysowym dalej się uczymy, tylko na prawdziwych danych. Możemy policzyć zapasy, prowadzić dziennik i planować kolejne sprawdzenie. Ty liczysz i zapisujesz, a ważne decyzje podejmuje dorosły.";
}
