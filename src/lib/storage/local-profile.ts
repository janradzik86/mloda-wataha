const KEY = "mloda-wataha.v1.learner";
const CHAT_KEY = "mloda-wataha.v1.school-help";

export type LocalLearner = {
  displayName: string;
  age: number | null;
  schoolClass: number | null;
  preferredStyle: "standard" | "simple" | "step_by_step" | "example" | "mission";
  lastSchoolTopics: string[];
  lastSubject: string | null;
  updatedAt: number;
};

const empty: LocalLearner = {
  displayName: "",
  age: null,
  schoolClass: null,
  preferredStyle: "simple",
  lastSchoolTopics: [],
  lastSubject: null,
  updatedAt: 0,
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readLocalLearner(): LocalLearner {
  if (!canUseStorage()) return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<LocalLearner>;
    return {
      ...empty,
      ...parsed,
      lastSchoolTopics: Array.isArray(parsed.lastSchoolTopics) ? parsed.lastSchoolTopics : [],
    };
  } catch {
    return empty;
  }
}

export function writeLocalLearner(patch: Partial<LocalLearner>): LocalLearner {
  const next: LocalLearner = {
    ...readLocalLearner(),
    ...patch,
    updatedAt: Date.now(),
  };
  if (canUseStorage()) {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export type LocalChatTurn = {
  id: string;
  role: "child" | "wolf";
  text: string;
  at: number;
};

export function readSchoolHelpDraft(): LocalChatTurn[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalChatTurn[];
    return Array.isArray(parsed) ? parsed.slice(-40) : [];
  } catch {
    return [];
  }
}

export function writeSchoolHelpDraft(turns: LocalChatTurn[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CHAT_KEY, JSON.stringify(turns.slice(-40)));
}

/** Role in localStorage is never an authorization source. */
export function readSpoofedRole(): string | null {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem("role") ?? window.localStorage.getItem("mloda-wataha.role");
  } catch {
    return null;
  }
}
