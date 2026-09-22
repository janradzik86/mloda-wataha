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

const crisisIntro = tutor.crisisLearningStart("Lena");
if (!crisisIntro.includes("prawdziwych danych")) throw new Error("Crisis learning intro missing");

const forecast = tutor.crisisSupplyForecast(
  { people: 4, supplies: [{ id:"rice", name:"Ryż", kind:"food", amount:8, unit:"kg" }] },
  { supplyId:"rice", plannedDailyAmountPerPerson:0.25 }
);
if (forecast.estimatedDays !== 8) throw new Error("Supply forecast calculation failed");

const waterForecast = tutor.crisisSupplyForecast(
  { people: 2, supplies: [{ id:"water", name:"Woda", kind:"water", amount:12, unit:"l" }] },
  { supplyId:"water", plannedDailyAmountPerPerson:0 }
);
if (!waterForecast.warning || waterForecast.estimatedDays !== null) throw new Error("Water safety guard failed");

const wildlife = tutor.wildlifeReasoningExample();
if (!wildlife.preferredOptionIds.includes("secure_food")) throw new Error("Safe indirect option should be preferred");
if (!wildlife.rejectedOptionIds.includes("hand_feed")) throw new Error("Direct wildlife feeding should be rejected");
if (!wildlife.rejectedOptionIds.includes("chase")) throw new Error("Risky chase should be rejected");

const logic = tutor.logicScenario("logic.homework");
if (!logic) throw new Error("Logic scenario missing");
const logicResult = tutor.evaluateLogic("logic.homework", "b");
if (!logicResult?.correct) throw new Error("Logic evaluation failed");

const safetyScenario = tutor.onlineSafetyScenario("unknown-adult-private-chat");
if (!safetyScenario) throw new Error("Online safety scenario missing");
const safetyResult = tutor.assessOnlineSafety("unknown-adult-private-chat");
if (!safetyResult || safetyResult.risk !== "high") throw new Error("High-risk contact not detected");
if (!safetyResult.recommendedActions.some(x => x.includes("rodzic"))) throw new Error("Trusted adult escalation missing");
