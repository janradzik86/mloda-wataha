import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { ENGINE_SOURCE } from "@/lib/young-wilk/contract";

const AskInput = z.object({
  text: z.string().max(800),
  mode: z.enum(["chat", "school-help"]).default("chat"),
  subject: z
    .enum([
      "math",
      "polish",
      "english",
      "science",
      "history",
      "geography",
      "physics",
      "chemistry",
      "biology",
      "computer_science",
      "other",
    ])
    .optional(),
});

export const askYoungWolf = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => AskInput.parse(input))
  .handler(async ({ context, data }) => {
    const { askWolf } = await import("@/lib/data/queries");
    return askWolf(context.userId, data.text, data.mode, data.subject);
  });

export const explainDifferently = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { loadLearnerProfile } = await import("@/lib/data/queries");
    const { createYoungWolfEngine } = await import("@/lib/young-wilk/adapter");
    const profile = await loadLearnerProfile(context.userId);
    const engine = createYoungWolfEngine({
      learnerId: profile.userId,
      age: profile.age ?? 10,
      schoolClass: profile.schoolClass ?? undefined,
      preferredStyle: profile.preferredStyle,
      difficultTopics: profile.reviewTopics,
      strongTopics: profile.strongTopics,
    });
    return { source: ENGINE_SOURCE, reply: engine.explainDifferently() };
  });
