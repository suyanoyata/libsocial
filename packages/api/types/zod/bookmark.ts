import { z } from "zod";

const bookmarkName = z.enum(["planned", "ongoing", "finished", "dropped", "favorite"]);

const modelName = z.enum(["manga", "anime"]);

export const bookmarkSchema = z
  .object({
    type: modelName,
    slug_url: z.string(),
    name: bookmarkName.optional().default("ongoing"),
    chapterIndex: z.number().optional(),
    episodeIndex: z.number().optional(),
  })
  .refine(
    (data) => {
      return !(data.episodeIndex && data.chapterIndex);
    },
    {
      message: "You can provide either episodeIndex or chapterIndex, but not both",
      path: ["episodeIndex"],
    }
  );

export const updateBookmarkSchema = z
  .object({
    id: z.number(),
    name: bookmarkName.optional().default("ongoing"),
    chapterIndex: z.number().optional(),
    episodeIndex: z.number().optional(),
  })
  .refine(
    (data) => {
      return !(data.episodeIndex && data.chapterIndex);
    },
    {
      message: "You can provide either episodeIndex or chapterIndex, but not both",
      path: ["episodeIndex"],
    }
  );

export const deleteBookmarkSchema = z.object({
  id: z.string(),
});

export type CreateBookmarkData = z.infer<typeof bookmarkSchema>;
export type UpdateBookmarkData = z.infer<typeof updateBookmarkSchema>;
export type DeleteBookmarkData = z.infer<typeof deleteBookmarkSchema>;
