import { YoungWolfTutor } from "./core";
import { evaluateDiagnostic } from "./diagnostic";

const tutor = new YoungWolfTutor({
  learnerId: "demo",
  age: 8,
  preferredStyle: "standard",
  difficultTopics: [],
  strongTopics: []
});

const a = tutor.explain("math.fractions.basic");
if (!a.text.includes("Pizza")) throw new Error("Age adaptation failed");

tutor.explain("crisis.basic", "mission");
const c = tutor.explainDifferently();
if (!c.crisis || c.style !== "standard") throw new Error("Crisis style lock failed");

const result = evaluateDiagnostic(
  [
    { id:"1", prompt:"", skill:"fraction-half", expected:4, explanation:"" },
    { id:"2", prompt:"", skill:"fraction-quarter", expected:2, explanation:"" }
  ],
  { "1":4, "2":1 }
);

if (result.decision !== "micro_review") throw new Error("Diagnostic routing failed");
if (result.rewardEligible) throw new Error("Reward should wait for mastery");
