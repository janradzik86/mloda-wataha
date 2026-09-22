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

const school = tutor.schoolHelp("Dzisiaj w szkole miałam ułamki i nie zrozumiałam, możesz mi to wytłumaczyć?");
if (!school.understoodRequest) throw new Error("School help intent not recognized");
if (school.matchedTopicId !== "math.fractions.basic") throw new Error("School topic matching failed");
if (school.needsClarification) throw new Error("Known school topic should not need clarification");

const unknownSchool = tutor.schoolHelp("Na historii mieliśmy coś o średniowieczu i nie zrozumiałam.");
if (!unknownSchool.understoodRequest) throw new Error("Unknown school topic intent not recognized");
if (!unknownSchool.needsClarification) throw new Error("Unknown topic should request clarification");

const startup = tutor.startup("Lena");
if (!startup.text.includes("szkole")) throw new Error("Startup school check-in missing");

const game = tutor.buildGame("Zrób grę o wilku, który zbiera gwiazdy w kosmosie");
if (game.theme !== "space") throw new Error("Game theme detection failed");
if (!game.blocks.includes("COLLECTIBLE")) throw new Error("Collect mechanic missing");
if (!game.offlineSafe) throw new Error("Generated game must be offline-safe");
