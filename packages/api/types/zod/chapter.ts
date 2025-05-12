import { z } from "zod";

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

export type MangaChapter = z.infer<typeof MangaChapterSchema>;
export type RemoteChapter = MangaChapter & {
  branches: {
    created_at: string;
  }[];
};
