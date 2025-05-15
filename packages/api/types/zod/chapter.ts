import { number, z } from "zod";

export const MangaBaseChapterSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  number: z.string(),
  number_secondary: z.string(),
  item_number: z.number(),
  volume: z.string(),
  created_at: z.date(),
});

export const MangaChapterSchema = MangaBaseChapterSchema.merge(
  z.object({
    likes_count: z.number(),
    manga_id: z.number(),
    slug: z.string(),
  })
);

export const MangaGetChapterSchema = z.object({
  slug_url: z.string(),
  volume: z.coerce.string(),
  number: z.coerce.string(),
});
export type MangaGetChapter = z.infer<typeof MangaGetChapterSchema>;

export type MangaChapter = z.infer<typeof MangaChapterSchema>;
export type RemoteChapter = MangaChapter & {
  branches: {
    created_at: string;
  }[];
};
