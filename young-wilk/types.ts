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

export interface YoungWolfAction {
  kind: "notify_parent" | "open_crisis" | "open_lesson" | "open_den" | "request_song";
  label: string;
  requiresParentApproval?: boolean;
}
