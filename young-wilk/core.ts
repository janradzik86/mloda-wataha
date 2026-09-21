import { lessonById } from "./knowledge";
import { evaluateDiagnostic } from "./diagnostic";
import type { AgeBand, DiagnosticQuestion, ExplainStyle, LearnerProfile, TutorReply } from "./types";

function ageBand(age: number): AgeBand {
  if (age <= 9) return "7-9";
  if (age <= 12) return "10-12";
  if (age <= 15) return "13-15";
  return "16+";
}

function stylePrefix(style: ExplainStyle) {
  switch (style) {
    case "simple": return "Najprościej: ";
    case "step_by_step": return "Krok po kroku: ";
    case "example": return "Przykład: ";
    case "mission": return "Misja Młodego Wilka: ";
    default: return "";
  }
}

export class YoungWolfTutor {
  private lastTopic?: string;
  private lastStyle: ExplainStyle;

  constructor(private profile: LearnerProfile) {
    this.lastStyle = profile.preferredStyle;
  }

  explain(topicId: string, style: ExplainStyle = this.lastStyle): TutorReply {
    const lesson = lessonById(topicId);
    const band = ageBand(this.profile.age);

    if (!lesson) {
      return {
        text: "Tego tematu nie mam jeszcze w zatwierdzonej bazie. Mogę pomóc w innym zadaniu albo poprosić administratora o dodanie materiału.",
        style,
        ageBand: band,
        suggestedNext: "ask_parent"
      };
    }

    this.lastTopic = topicId;
    this.lastStyle = style;

    const example = lesson.examplesByBand[band][0] ?? "";
    const practice = lesson.practiceByBand[band][0] ?? "";
    const body = lesson.safetyClass === "crisis"
      ? lesson.concept + " " + example
      : stylePrefix(style) + lesson.concept + " " + example;

    return {
      topicId,
      text: body + (practice ? " Spróbuj: " + practice : ""),
      style,
      ageBand: band,
      suggestedNext: "practice",
      crisis: lesson.safetyClass === "crisis"
    };
  }

  explainDifferently(): TutorReply {
    if (!this.lastTopic) {
      return {
        text: "Najpierw wybierz temat, który mam wyjaśnić.",
        style: this.lastStyle,
        ageBand: ageBand(this.profile.age)
      };
    }

    if (lessonById(this.lastTopic)?.safetyClass === "crisis") {
      return this.explain(this.lastTopic, "standard");
    }

    const next: ExplainStyle = this.lastStyle === "simple"
      ? "example"
      : this.lastStyle === "example"
        ? "step_by_step"
        : this.lastStyle === "step_by_step"
          ? "mission"
          : "simple";

    return this.explain(this.lastTopic, next);
  }

  adaptFromPhrase(input: string): ExplainStyle {
    const q = input.toLowerCase();
    if (q.includes("nie rozumiem") || q.includes("prościej") || q.includes("nie kumam")) return "simple";
    if (q.includes("krok po kroku") || q.includes("po kolei")) return "step_by_step";
    if (q.includes("przykład") || q.includes("pokaż na przykładzie")) return "example";
    if (q.includes("zrób z tego grę") || q.includes("misja")) return "mission";
    return this.lastStyle;
  }

  diagnostic(questions: DiagnosticQuestion[], answers: Record<string, string | number | boolean>) {
    return evaluateDiagnostic(questions, answers);
  }

  updateProfile(next: Partial<LearnerProfile>) {
    this.profile = { ...this.profile, ...next };
  }
}
