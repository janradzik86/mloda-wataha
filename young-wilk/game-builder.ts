export type GameBlockType =
  | "PLAYER" | "ITEM" | "TREE" | "BRIDGE" | "DEN" | "FIRE"
  | "QUESTION" | "ANSWER" | "SCORE" | "TIMER" | "MAZE"
  | "MEMORY_CARD" | "COLLECTIBLE" | "DOOR";

export interface GameRule {
  when: string;
  then: string;
}

export interface GameBlueprint {
  title: string;
  theme: "forest" | "space" | "castle" | "ocean" | "winter" | "volcano";
  blocks: GameBlockType[];
  rules: GameRule[];
  learningTopicId?: string;
  offlineSafe: boolean;
}

export interface GameBuildRequest {
  rawText: string;
  learningTopicId?: string;
}

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
}

export function buildGameBlueprint(req: GameBuildRequest): GameBlueprint {
  const q = norm(req.rawText);
  const theme: GameBlueprint["theme"] =
    q.includes("kosmos") ? "space" :
    q.includes("zamek") ? "castle" :
    q.includes("ocean") ? "ocean" :
    q.includes("zima") ? "winter" :
    q.includes("wulkan") ? "volcano" : "forest";

  const isMaze = q.includes("labirynt");
  const isCollect = q.includes("zbier") || q.includes("lap") || q.includes("gwiazd");
  const wantsQuiz = q.includes("pytan") || q.includes("quiz") || Boolean(req.learningTopicId);

  const blocks: GameBlockType[] = ["PLAYER", "SCORE"];
  if (isMaze) blocks.push("MAZE", "DOOR");
  if (isCollect) blocks.push("COLLECTIBLE");
  if (wantsQuiz) blocks.push("QUESTION", "ANSWER");
  if (!isMaze && !isCollect) blocks.push("TREE", "DEN", "ITEM");

  const rules: GameRule[] = [];
  if (isCollect) rules.push({ when: "PLAYER_TOUCHES_COLLECTIBLE", then: "SCORE_PLUS_1" });
  if (wantsQuiz) rules.push({ when: "ANSWER_CORRECT", then: "OPEN_DOOR_OR_REWARD" });
  if (isMaze) rules.push({ when: "SCORE_AT_LEAST_3", then: "OPEN_DOOR" });
  if (!rules.length) rules.push({ when: "PLAYER_TOUCHES_ITEM", then: "SCORE_PLUS_1" });

  return {
    title: suggestTitle(req.rawText),
    theme,
    blocks,
    rules,
    learningTopicId: req.learningTopicId,
    offlineSafe: true
  };
}

function suggestTitle(raw: string) {
  const q = norm(raw);
  if (q.includes("gwiazd")) return "Wilk i Gwiezdny Szlak";
  if (q.includes("labirynt")) return "Leśny Labirynt Wilka";
  if (q.includes("ulam")) return "Ułamkowa Wyprawa";
  return "Przygoda Młodego Wilka";
}

export function explainCodingBlock(rule: GameRule): string {
  return `To działa tak: JEŚLI ${rule.when}, TO ${rule.then}. To jest podstawowy schemat programowania: zdarzenie → reakcja.`;
}
