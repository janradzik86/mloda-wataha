/**
 * Contract for Młody WILK — the educational engine owned by ChatGPT
 * (branch chatgpt/mlody-wilk-v0.1, PR #1).
 *
 * Do not invent a second tutor engine here. These types match
 * young-wilk/types.ts so the UI can swap stub → real core on merge.
 */

export type AgeBand = "7-9" | "10-12" | "13-15" | "16+";
export type ExplainStyle = "standard" | "simple" | "step_by_step" | "example" | "mission";

export interface LearnerProfile {
  learnerId: string;
  age: number;
  schoolClass?: number;
  preferredStyle: ExplainStyle;
  difficultTopics: string[];
  strongTopics: string[];
}

export interface LessonChunk {
  topicId: string;
  title: string;
  concept: string;
  examplesByBand: Record<AgeBand, string[]>;
  practiceByBand: Record<AgeBand, string[]>;
  prerequisites?: string[];
  safetyClass?: "normal" | "crisis";
}

export interface TutorReply {
  topicId?: string;
  text: string;
  style: ExplainStyle;
  ageBand: AgeBand;
  suggestedNext?: "practice" | "diagnostic_quiz" | "micro_review" | "next_topic" | "ask_parent";
  crisis?: boolean;
}

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  skill: string;
  expected: string | number | boolean;
  explanation: string;
}

export interface DiagnosticResult {
  mastered: boolean;
  weakSkills: string[];
  decision: "proceed" | "micro_review" | "alternate_explanation" | "prerequisite_review";
  rewardEligible: boolean;
}

export type SchoolSubject =
  | "math"
  | "polish"
  | "english"
  | "science"
  | "history"
  | "geography"
  | "physics"
  | "chemistry"
  | "biology"
  | "computer_science"
  | "other";

export interface SchoolHelpRequest {
  rawText: string;
  subject?: SchoolSubject;
  topicHint?: string;
  saidDidNotUnderstand: boolean;
}

export interface SchoolHelpReply {
  understoodRequest: boolean;
  matchedTopicId?: string;
  subject?: SchoolSubject;
  reply: TutorReply;
  needsClarification: boolean;
  clarificationPrompt?: string;
}

export interface YoungWolfEngine {
  explain(topicId: string, style?: ExplainStyle): TutorReply;
  explainDifferently(): TutorReply;
  adaptFromPhrase(input: string): ExplainStyle;
  schoolHelp(rawText: string, extras?: Partial<SchoolHelpRequest>): SchoolHelpReply;
  diagnostic(
    questions: DiagnosticQuestion[],
    answers: Record<string, string | number | boolean>,
  ): DiagnosticResult;
  updateProfile(next: Partial<LearnerProfile>): void;
  getAgeBand(): AgeBand;
}

export const ENGINE_SOURCE = {
  branch: "chatgpt/mlody-wilk-v0.1",
  pullRequest: "https://github.com/janradzik86/mloda-wataha/pull/1",
  status: "pending_integration",
} as const;

export function ageBandFromAge(age: number): AgeBand {
  if (age <= 9) return "7-9";
  if (age <= 12) return "10-12";
  if (age <= 15) return "13-15";
  return "16+";
}

export const CHILD_DECISION_COPY: Record<DiagnosticResult["decision"], string> = {
  proceed: "Dobra, to już siedzi. Lecimy dalej.",
  micro_review: "Jeszcze jedna rzecz i lecimy dalej.",
  alternate_explanation: "Pokażę Ci to inaczej.",
  prerequisite_review: "Wróćmy na chwilę do jednego kroku.",
};
