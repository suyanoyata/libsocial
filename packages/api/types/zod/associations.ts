import { z } from "zod";

const relationReasonSchema = z.enum(["prequel", "sequel", "spinoff"]);
const similarReasonSchema = z.enum(["genres", "script"]);

export const createRelationSchema = z.object({
  slug_url: z.string(),
  type: z.enum(["anime", "manga"]),
  related: z.object({
    slug_url: z.string(),
    reason: relationReasonSchema,
  }),
});

export const createSimilarSchema = z.object({
  slug_url: z.string(),
  type: z.enum(["anime", "manga"]),
  similar: z.object({
    slug_url: z.string(),
    reason: similarReasonSchema,
  }),
});

export type CreateRelationData = z.infer<typeof createRelationSchema>;
export type CreateSimilarData = z.infer<typeof createSimilarSchema>;
