import { number, z } from "zod";

import { GenreSchema } from "types/zod/base";

export const AnimeSchema = z.object({
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
  site: z.union([z.literal(1), z.literal(3), z.literal(5)], {
    message: "Invalid site id",
  }),
  genres: z.array(GenreSchema),
});

export const AnimeEpisodeSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  number: z.string(),
  number_secondary: z.string(),
  item_number: z.number(),
});

export type AnimeEpisode = z.infer<typeof AnimeEpisodeSchema>;

export type Anime = z.infer<typeof AnimeSchema>;
