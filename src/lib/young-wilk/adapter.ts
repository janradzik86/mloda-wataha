import type { LearnerProfile, YoungWolfEngine } from "./contract";
import { StubYoungWolf } from "./stub";

/**
 * Swap this factory after merging chatgpt/mlody-wilk-v0.1:
 *
 *   import { YoungWolfTutor } from "../../../young-wilk/core";
 *   return new YoungWolfTutor(profile);
 *
 * Do not copy the tutor logic into this folder.
 */
export function createYoungWolfEngine(profile: LearnerProfile): YoungWolfEngine {
  return new StubYoungWolf(profile);
}
