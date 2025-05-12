import { z } from "zod";

const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  adult: z.boolean(),
});

export const MangaSchema = z.object({
  id: z.number(),
  name: z.string(),
  rus_name: z.string().optional(),
  eng_name: z.string().optional(),
  otherNames: z.array(z.string()).optional(),
  slug_url: z.string(),
  background: z.object({
    url: z.string(),
  }),
  summary: z.string().optional().nullable(),
  model: z.enum(["manga", "anime"]),
  cover: z.object({
    thumbnail: z.string(),
    default: z.string(),
  }),
  ageRestriction: z.object({
    id: z.number(),
    label: z.string(),
  }),
  items_count: z.object({
    uploaded: z.number(),
  }),
  site: z.union([z.literal(1), z.literal(3), z.literal(5)], {
    message: "Invalid site id",
  }),
  genres: z.array(GenreSchema),
});

export type Item = z.infer<typeof MangaSchema>;
