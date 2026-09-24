import type { DiagnosticQuestion, DiagnosticResult } from "./types";

export function evaluateDiagnostic(
  questions: DiagnosticQuestion[],
  answers: Record<string, string | number | boolean>
): DiagnosticResult {
  const weakSkills: string[] = [];
  let correct = 0;

  for (const q of questions) {
    if (String(answers[q.id] ?? "").trim().toLowerCase() === String(q.expected).trim().toLowerCase()) {
      correct++;
    } else {
      weakSkills.push(q.skill);
    }
  }

  const ratio = questions.length === 0 ? 0 : correct / questions.length;

  if (ratio >= 0.85) {
    return { mastered: true, weakSkills: [], decision: "proceed", rewardEligible: true };
  }
  if (ratio >= 0.6) {
    return { mastered: false, weakSkills: [...new Set(weakSkills)], decision: "micro_review", rewardEligible: false };
  }
  if (ratio >= 0.35) {
    return { mastered: false, weakSkills: [...new Set(weakSkills)], decision: "alternate_explanation", rewardEligible: false };
  }
  return { mastered: false, weakSkills: [...new Set(weakSkills)], decision: "prerequisite_review", rewardEligible: false };
}

// Wynik jest dla silnika. UI dziecka nie powinno pokazywać procentów ani ocen.
