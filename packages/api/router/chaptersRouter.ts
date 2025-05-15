import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { AppRouter, t } from "~/lib/trpc";

import { Mangadex } from "~/const/api";

import axios from "axios";

import { throwable } from "~/lib/utils";

import { ChapterService, mangaService } from "~/services";

import { z } from "zod";
import { MangaGetChapterSchema } from "~/types/zod/chapter";

type RouterOutput = inferRouterOutputs<AppRouter>["chapters"];

export const chaptersRouter = t.router({
  list: t.procedure.input(z.string()).query(async ({ input }) => {
    return await ChapterService.getChapters(input);
  }),
  get: t.procedure.input(MangaGetChapterSchema).query(async ({ input }) => {
    const manga = await mangaService.getManga(input.slug_url);

    const chapter = await ChapterService.getChapter(input);

    const id = (await axios.get(Mangadex.search(manga.eng_name!))).data.data[0]
      .id;

    const {
      data: { data: _mangadexChapters },
    } = await axios.get(Mangadex.chapters(id));

    const mangadexChapter = _mangadexChapters.find(
      (mangadexChapter: {
        attributes: {
          volume: string;
          chapter: string;
          translatedLanguage: string;
        };
      }) =>
        mangadexChapter.attributes.volume == input.volume &&
        mangadexChapter.attributes.chapter == input.number &&
        mangadexChapter.attributes.translatedLanguage == "en"
    );

    if (!mangadexChapter) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Content is licensed or not found.",
      });
    }

    if (mangadexChapter.attributes.pages == chapter.pages.length) {
      return chapter;
    }

    const { error: downloadError } = await throwable(
      ChapterService.downloadChapter(String(chapter.id), mangadexChapter.id)
    );

    if (downloadError) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" });
    }

    return chapter;
  }),
});

export type Chapter = RouterOutput["list"][number];
