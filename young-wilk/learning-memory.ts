import type { ExplainStyle, LearnerProfile } from "./types";

export interface LearningMemory {
  preferredStyle: ExplainStyle;
  difficultTopics: string[];
  strongTopics: string[];
  recentSchoolTopics: Array<{
    topicId?: string;
    subject?: string;
    note: string;
    understoodAfterHelp: boolean;
    at: string;
  }>;
}

export interface LearningMemoryStore {
  load(learnerId: string): Promise<LearningMemory | null>;
  save(learnerId: string, memory: LearningMemory): Promise<void>;
}

export function defaultMemory(profile: LearnerProfile): LearningMemory {
  return {
    preferredStyle: profile.preferredStyle,
    difficultTopics: [...profile.difficultTopics],
    strongTopics: [...profile.strongTopics],
    recentSchoolTopics: []
  };
}

export async function rememberSchoolDifficulty(
  store: LearningMemoryStore,
  profile: LearnerProfile,
  note: string,
  topicId?: string,
  subject?: string
) {
  const memory = (await store.load(profile.learnerId)) ?? defaultMemory(profile);
  const difficult = topicId
    ? [...new Set([...memory.difficultTopics, topicId])]
    : memory.difficultTopics;

  memory.difficultTopics = difficult;
  memory.recentSchoolTopics = [
    ...memory.recentSchoolTopics,
    { topicId, subject, note, understoodAfterHelp: false, at: new Date().toISOString() }
  ].slice(-30);

  await store.save(profile.learnerId, memory);
}

export async function markUnderstood(
  store: LearningMemoryStore,
  profile: LearnerProfile,
  topicId: string
) {
  const memory = (await store.load(profile.learnerId)) ?? defaultMemory(profile);
  memory.difficultTopics = memory.difficultTopics.filter(x => x !== topicId);
  memory.strongTopics = [...new Set([...memory.strongTopics, topicId])];
  memory.recentSchoolTopics = memory.recentSchoolTopics.map(x =>
    x.topicId === topicId ? { ...x, understoodAfterHelp: true } : x
  );
  await store.save(profile.learnerId, memory);
}
