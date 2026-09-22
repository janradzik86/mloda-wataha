import {
  ageBandFromAge,
  type ExplainStyle,
  type LearnerProfile,
  type SchoolHelpReply,
  type SchoolHelpRequest,
  type TutorReply,
  type YoungWolfEngine,
  type DiagnosticQuestion,
  type DiagnosticResult,
} from "./contract";

/**
 * Placeholder until young-wilk/core.ts from chatgpt/mlody-wilk-v0.1 is merged.
 * Does not guess school content. Does not award mastery.
 */
export class StubYoungWolf implements YoungWolfEngine {
  private lastTopic?: string;
  private lastStyle: ExplainStyle;
  private profile: LearnerProfile;

  constructor(profile: LearnerProfile) {
    this.profile = profile;
    this.lastStyle = profile.preferredStyle;
  }

  explain(_topicId: string, style: ExplainStyle = this.lastStyle): TutorReply {
    const band = this.getAgeBand();
    return {
      text: "Młody Wilk jeszcze składa swoją torbę z lekcjami. Napisz, co było w szkole — zapamiętam i wrócę do tego, gdy silnik będzie podłączony.",
      style,
      ageBand: band,
      suggestedNext: "ask_parent",
    };
  }

  explainDifferently(): TutorReply {
    const next: ExplainStyle =
      this.lastStyle === "simple"
        ? "example"
        : this.lastStyle === "example"
          ? "step_by_step"
          : this.lastStyle === "step_by_step"
            ? "mission"
            : "simple";
    this.lastStyle = next;
    return {
      text:
        next === "simple"
          ? "Spróbujmy prościej. Opowiedz mi to jednym zdaniem z zeszytu."
          : next === "example"
            ? "Pokaż mi jedno zadanie. Nie musisz znać nazwy tematu."
            : next === "step_by_step"
              ? "Zróbmy to po kolei. Co pani albo pan napisał na tablicy jako pierwsze?"
              : "Misja: znajdź w zeszycie jedno zdanie, którego nie rozumiesz, i wpisz je tutaj.",
      style: next,
      ageBand: this.getAgeBand(),
    };
  }

  adaptFromPhrase(input: string): ExplainStyle {
    const q = input.toLowerCase();
    if (q.includes("nie rozumiem") || q.includes("prościej") || q.includes("nie kumam")) return "simple";
    if (q.includes("krok po kroku") || q.includes("po kolei")) return "step_by_step";
    if (q.includes("przykład") || q.includes("pokaż na przykładzie")) return "example";
    if (q.includes("zrób z tego grę") || q.includes("misja")) return "mission";
    return this.lastStyle;
  }

  schoolHelp(rawText: string, extras?: Partial<SchoolHelpRequest>): SchoolHelpReply {
    const text = rawText.trim();
    const band = this.getAgeBand();
    const style = this.adaptFromPhrase(text);
    this.lastStyle = style;

    if (!text) {
      return {
        understoodRequest: false,
        needsClarification: true,
        clarificationPrompt: "Jak nazywał się temat? Albo wpisz jedno zdanie z zeszytu.",
        reply: {
          text: "Jestem tu. Powiedz, czego dziś nie złapałeś w szkole — spokojnie, bez ocen.",
          style,
          ageBand: band,
        },
      };
    }

    const reply: TutorReply = {
      text:
        "Słyszę Cię. Silnik Młodego Wilka jest już przygotowany i czeka na podłączenie — wtedy wytłumaczę to językiem dopasowanym do Twojej klasy, dam przykład i jedno małe ćwiczenie. " +
        "Na razie zapamiętuję Twoje słowa i nie zgaduję tematu. " +
        "Jeśli możesz: jak nazywał się temat, albo pokaż jedno zadanie.",
      style,
      ageBand: band,
      suggestedNext: "ask_parent",
    };

    return {
      understoodRequest: Boolean(extras?.saidDidNotUnderstand || /nie (zrozum|kum)/i.test(text)),
      subject: extras?.subject,
      needsClarification: true,
      clarificationPrompt: "Jak nazywał się temat? Możesz też wpisać jedno zadanie albo zdanie z zeszytu.",
      reply,
    };
  }

  diagnostic(
    _questions: DiagnosticQuestion[],
    _answers: Record<string, string | number | boolean>,
  ): DiagnosticResult {
    return {
      mastered: false,
      weakSkills: [],
      decision: "alternate_explanation",
      rewardEligible: false,
    };
  }

  updateProfile(next: Partial<LearnerProfile>) {
    this.profile = { ...this.profile, ...next };
  }

  getAgeBand() {
    return ageBandFromAge(this.profile.age || 10);
  }
}
