import type { ExplainStyle } from "./types";

export interface TeachingOutcome {
  topicId: string;
  style: ExplainStyle;
  understood: boolean;
  neededHint?: boolean;
  solvedIndependently?: boolean;
  responseTimeMs?: number;
  childSignal?: "easy" | "ok" | "hard" | "frustrated" | "engaged";
  at: string;
}

export interface TeachingContext {
  topicId: string;
  childText?: string;
  recentOutcomes?: TeachingOutcome[];
  fallbackStyle?: ExplainStyle;
}

const STYLES: ExplainStyle[] = ["simple", "step_by_step", "example", "mission", "standard"];

/**
 * Dobiera sposób nauki automatycznie na podstawie tego, co faktycznie pomaga dziecku.
 * Nie wystawia ocen dziecku i nie tworzy trwałych etykiet typu "słaby z matematyki".
 */
export function chooseTeachingStyle(ctx: TeachingContext): ExplainStyle {
  const scores = new Map<ExplainStyle, number>(STYLES.map(s => [s, 0]));
  const outcomes = (ctx.recentOutcomes ?? []).filter(x => x.topicId === ctx.topicId).slice(-20);

  for (const x of outcomes) {
    let delta = x.understood ? 4 : -3;
    if (x.solvedIndependently) delta += 3;
    if (x.neededHint) delta -= 1;
    if (x.childSignal === "engaged" || x.childSignal === "easy") delta += 2;
    if (x.childSignal === "hard" || x.childSignal === "frustrated") delta -= 2;
    scores.set(x.style, (scores.get(x.style) ?? 0) + delta);
  }

  const q = normalize(ctx.childText ?? "");
  // Wypowiedź dziecka jest sygnałem, nie przełącznikiem trybu.
  if (containsAny(q, "nie rozumiem", "nie kumam", "za trudne", "pogubilem", "pogubilam")) {
    bump(scores, "simple", 4);
    bump(scores, "example", 3);
    bump(scores, "step_by_step", 2);
  }
  if (containsAny(q, "jak to zrobic", "jak to zrobić", "co najpierw", "po kolei")) {
    bump(scores, "step_by_step", 4);
  }
  if (containsAny(q, "pokaz przyklad", "pokaż przykład", "na przykladzie", "na przykładzie")) {
    bump(scores, "example", 4);
  }
  if (containsAny(q, "nudne", "nuda", "nie chce mi sie", "nie chce mi się")) {
    bump(scores, "mission", 3);
    bump(scores, "example", 2);
  }

  // Gdy wcześniejsza metoda nie pomogła, nie powtarzaj jej bez końca.
  const last = outcomes[outcomes.length - 1];
  if (last && !last.understood) {
    bump(scores, last.style, -5);
    for (const alt of alternateStyles(last.style)) bump(scores, alt, 2);
  }

  // Pierwszy kontakt: profil jest tylko miękkim punktem startowym.
  if (outcomes.length === 0 && ctx.fallbackStyle) {
    bump(scores, ctx.fallbackStyle, 1);
  }

  return STYLES.reduce((best, style) =>
    (scores.get(style) ?? 0) > (scores.get(best) ?? 0) ? style : best
  , ctx.fallbackStyle ?? "standard");
}

export class AdaptiveTeachingMemory {
  private outcomes: TeachingOutcome[] = [];

  record(outcome: TeachingOutcome) {
    this.outcomes.push(outcome);
    this.outcomes = this.outcomes.slice(-300);
  }

  recent(topicId?: string): TeachingOutcome[] {
    const list = topicId ? this.outcomes.filter(x => x.topicId === topicId) : this.outcomes;
    return list.slice(-40);
  }

  choose(topicId: string, childText?: string, fallbackStyle?: ExplainStyle): ExplainStyle {
    return chooseTeachingStyle({
      topicId,
      childText,
      fallbackStyle,
      recentOutcomes: this.recent(topicId)
    });
  }
}

function alternateStyles(style: ExplainStyle): ExplainStyle[] {
  switch (style) {
    case "simple": return ["example", "step_by_step"];
    case "example": return ["step_by_step", "mission"];
    case "step_by_step": return ["example", "simple"];
    case "mission": return ["example", "simple"];
    default: return ["simple", "example"];
  }
}

function bump(scores: Map<ExplainStyle, number>, style: ExplainStyle, delta: number) {
  scores.set(style, (scores.get(style) ?? 0) + delta);
}

function containsAny(q: string, ...phrases: string[]) {
  return phrases.some(p => q.includes(normalize(p)));
}

function normalize(s: string) {
  return s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .trim();
}
