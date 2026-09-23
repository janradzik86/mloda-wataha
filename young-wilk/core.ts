import { lessonById } from "./knowledge";
import { evaluateDiagnostic } from "./diagnostic";
import type { AgeBand, DiagnosticQuestion, ExplainStyle, LearnerProfile, TutorReply } from "./types";
import { handleSchoolHelp } from "./school-help";
import { buildGameBlueprint } from "./game-builder";
import { createStartupPrompt } from "./startup";
import { crisisLearningIntro, forecastSupply, makeCrisisLearningTasks } from "./crisis-learning";
import { analyzeCrisisProblem, wildlifeProblemTemplate } from "./adaptive-crisis-reasoning";
import { evaluateLogicScenario, logicScenarioById, LOGIC_SCENARIOS } from "./logic-thinking";
import { assessOnlineContact, ONLINE_SAFETY_SCENARIOS, onlineSafetyRulebook } from "./online-safety-thinking";
import { assessChildReportedContact } from "./online-safety-triage";
import { RIGHTS_LESSONS, rightsLessonById, rightsLearningRules } from "./rights-education";
import { CIVIC_RIGHTS_AND_DUTIES, civicLessonById, civicLearningPrinciples } from "./civic-rights-duties";
import { AdaptiveTeachingMemory, type TeachingOutcome } from "./adaptive-teaching";

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
  private teachingMemory = new AdaptiveTeachingMemory();

  constructor(private profile: LearnerProfile) {
    this.lastStyle = profile.preferredStyle;
  }

  explain(topicId: string, style?: ExplainStyle, childText?: string): TutorReply {
    const lesson = lessonById(topicId);
    const band = ageBand(this.profile.age);
    const selectedStyle = style ?? this.teachingMemory.choose(
      topicId,
      childText,
      this.profile.preferredStyle
    );

    if (!lesson) {
      return {
        text: "Tego tematu nie mam jeszcze w zatwierdzonej bazie. Mogę pomóc w innym zadaniu albo poprosić administratora o dodanie materiału.",
        style: selectedStyle,
        ageBand: band,
        suggestedNext: "ask_parent"
      };
    }

    this.lastTopic = topicId;
    this.lastStyle = selectedStyle;

    const example = lesson.examplesByBand[band][0] ?? "";
    const practice = lesson.practiceByBand[band][0] ?? "";
    const body = lesson.safetyClass === "crisis"
      ? lesson.concept + " " + example
      : stylePrefix(selectedStyle) + lesson.concept + " " + example;

    return {
      topicId,
      text: body + (practice ? " Spróbuj: " + practice : ""),
      style: selectedStyle,
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

  schoolHelp(rawText: string) {
    return handleSchoolHelp(this, rawText);
  }

  /**
   * Po każdej próbie Młody WILK dostaje wynik i sam koryguje sposób nauczania.
   * UI nie musi pokazywać dziecku przełączników stylu.
   */
  recordTeachingOutcome(outcome: Omit<TeachingOutcome, "at"> & { at?: string }) {
    this.teachingMemory.record({
      ...outcome,
      at: outcome.at ?? new Date().toISOString()
    });
  }

  chooseTeachingStyle(topicId: string, childText?: string): ExplainStyle {
    return this.teachingMemory.choose(topicId, childText, this.profile.preferredStyle);
  }

  recentTeachingOutcomes(topicId?: string) {
    return this.teachingMemory.recent(topicId);
  }

  startup(childName?: string) {
    return createStartupPrompt(childName);
  }

  buildGame(rawText: string, learningTopicId?: string) {
    return buildGameBlueprint({ rawText, learningTopicId });
  }

  crisisLearningStart(childName?: string) {
    return crisisLearningIntro(childName);
  }

  crisisSupplyForecast(plan: Parameters<typeof forecastSupply>[0], input: Parameters<typeof forecastSupply>[1]) {
    return forecastSupply(plan, input);
  }

  crisisLearningTasks(plan: Parameters<typeof makeCrisisLearningTasks>[0], forecasts: Parameters<typeof makeCrisisLearningTasks>[1]) {
    return makeCrisisLearningTasks(plan, forecasts);
  }

  crisisReason(problem: Parameters<typeof analyzeCrisisProblem>[0]) {
    return analyzeCrisisProblem(problem);
  }

  wildlifeReasoningExample() {
    return analyzeCrisisProblem(wildlifeProblemTemplate());
  }

  logicScenarios() {
    return LOGIC_SCENARIOS;
  }

  logicScenario(id: string) {
    return logicScenarioById(id);
  }

  evaluateLogic(id: string, chosenOptionId: string) {
    const scenario = logicScenarioById(id);
    if (!scenario) return undefined;
    return evaluateLogicScenario(scenario, chosenOptionId);
  }

  onlineSafetyScenarios() {
    return ONLINE_SAFETY_SCENARIOS;
  }

  onlineSafetyScenario(id: string) {
    return ONLINE_SAFETY_SCENARIOS.find(x => x.id === id);
  }

  assessOnlineSafety(id: string) {
    const scenario = ONLINE_SAFETY_SCENARIOS.find(x => x.id === id);
    if (!scenario) return undefined;
    return assessOnlineContact(scenario);
  }

  onlineSafetyRules() {
    return onlineSafetyRulebook();
  }

  assessReportedOnlineContact(input: Parameters<typeof assessChildReportedContact>[0]) {
    return assessChildReportedContact(input);
  }

  rightsLessons() {
    return RIGHTS_LESSONS;
  }

  rightsLesson(id: string) {
    return rightsLessonById(id);
  }

  rightsRules() {
    return rightsLearningRules();
  }

  civicLessons() {
    return CIVIC_RIGHTS_AND_DUTIES;
  }

  civicLesson(id: string) {
    return civicLessonById(id);
  }

  civicPrinciples() {
    return civicLearningPrinciples();
  }

  getAgeBand(): AgeBand {
    return ageBand(this.profile.age);
  }

  diagnostic(questions: DiagnosticQuestion[], answers: Record<string, string | number | boolean>) {
    return evaluateDiagnostic(questions, answers);
  }

  updateProfile(next: Partial<LearnerProfile>) {
    this.profile = { ...this.profile, ...next };
  }
}
