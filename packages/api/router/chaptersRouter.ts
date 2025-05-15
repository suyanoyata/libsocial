import { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { AppRouter, t } from "~/lib/trpc";

import { ChapterService } from "~/services";
import { MangaGetChapterSchema } from "~/types/zod/chapter";

type RouterOutput = inferRouterOutputs<AppRouter>["chapters"];

export const chaptersRouter = t.router({
  list: t.procedure.input(z.string()).query(async ({ input }) => {
    return await ChapterService.getChapters(input);
  }),
  get: t.procedure.input(MangaGetChapterSchema).query(async ({ input }) => {
    return await ChapterService.getChapter(input);
  }),
});

export type Chapter = RouterOutput["list"][number];
