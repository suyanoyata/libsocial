import { z } from "zod";

const relationReasonSchema = z.enum(["prequel", "sequel", "spinoff"]);

export const createRelationSchema = z.object({
  slug_url: z.string(),
  type: z.enum(["anime", "manga"]),
  related: z.object({
    slug_url: z.string(),
    reason: relationReasonSchema,
  }),
});

export type CreateRelationData = z.infer<typeof createRelationSchema>;
