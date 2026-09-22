import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { ExplainStyle } from "@/lib/young-wilk/contract";

const ProfilePatch = z.object({
  displayName: z.string().trim().min(1).max(40).optional(),
  age: z.number().int().min(6).max(18).nullable().optional(),
  schoolClass: z.number().int().min(1).max(8).nullable().optional(),
  preferredStyle: z
    .enum(["standard", "simple", "step_by_step", "example", "mission"])
    .optional(),
  learningPace: z.enum(["slow", "steady", "fast"]).optional(),
});

export type LearnerProfileRow = {
  userId: string;
  displayName: string;
  age: number | null;
  schoolClass: number | null;
  preferredStyle: ExplainStyle;
  learningPace: string;
  strongTopics: string[];
  reviewTopics: string[];
  lastSchoolTopics: string[];
  lastSubject: string | null;
  lollipopBalance: number;
};

export const getLearnerProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { loadLearnerProfile } = await import("@/lib/data/queries");
    return loadLearnerProfile(context.userId);
  });

export const patchLearnerProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ProfilePatch.parse(input))
  .handler(async ({ context, data }) => {
    const { sql, loadLearnerProfile } = await import("@/lib/data/queries");
    const db = await sql();
    const current = await db<{ user_id: string }>`
      select user_id from learner_profiles where user_id = ${context.userId}
    `;
    if (current.length === 0) {
      await db`
        insert into learner_profiles (user_id, display_name)
        values (${context.userId}, ${data.displayName ?? ""})
      `;
    }
    await db`
      update learner_profiles set
        display_name = coalesce(${data.displayName ?? null}, display_name),
        age = coalesce(${data.age ?? null}, age),
        school_class = coalesce(${data.schoolClass ?? null}, school_class),
        preferred_style = coalesce(${data.preferredStyle ?? null}, preferred_style),
        learning_pace = coalesce(${data.learningPace ?? null}, learning_pace),
        updated_at = now()
      where user_id = ${context.userId}
    `;
    return loadLearnerProfile(context.userId);
  });

export const rememberSchoolTopic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        topic: z.string().trim().min(1).max(120),
        subject: z.string().max(40).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { sql, loadLearnerProfile } = await import("@/lib/data/queries");
    const current = await loadLearnerProfile(context.userId);
    const next = [data.topic, ...current.lastSchoolTopics.filter((t) => t !== data.topic)].slice(0, 8);
    const db = await sql();
    await db.query(
      `update learner_profiles
       set last_school_topics = $1::text[],
           last_subject = coalesce($2, last_subject),
           updated_at = now()
       where user_id = $3`,
      [next, data.subject ?? null, context.userId],
    );
    return { lastSchoolTopics: next };
  });
