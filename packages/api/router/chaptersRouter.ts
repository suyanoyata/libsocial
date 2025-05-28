import { inferRouterOutputs, TRPCError } from "@trpc/server"
import axios from "axios"
import { z } from "zod"
import { Mangadex } from "~/const/api"
import { AppRouter, t } from "~/lib/trpc"

import { throwable } from "~/lib/utils"

import { ChapterService, mangaService } from "~/services"

import { MangaGetChapterSchema } from "~/types/zod/chapter"

type RouterOutput = inferRouterOutputs<AppRouter>["chapters"]

export const chaptersRouter = t.router({
  list: t.procedure.input(z.string()).query(async ({ input }) => {
    return await ChapterService.getChapters(input)
  }),
  get: t.procedure.input(MangaGetChapterSchema).query(async ({ input }) => {
    const manga = await mangaService.getManga(input.slug_url)

    const chapter = await ChapterService.getChapter(input)

    // This should speed up response time
    if (chapter.pages.length != 0 && chapter.pages.length >= chapter.count) {
      return chapter
    }

    const {
      data: { data }
    } = await axios.get(Mangadex.search(manga.name!))

    if (data.length == 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Content is licensed or not found."
      })
    }

    const id = data[0].id

    const {
      data: { data: _mangadexChapters }
    } = await axios.get(Mangadex.chapters(id))

    const mangadexChapter = _mangadexChapters.find(
      (mangadexChapter: {
        attributes: {
          volume: string
          chapter: string
          translatedLanguage: string
          externalUrl: string | null
        }
      }) =>
        mangadexChapter.attributes.volume == input.volume &&
        mangadexChapter.attributes.chapter == input.number &&
        mangadexChapter.attributes.translatedLanguage == "en"
      // && mangadexChapter.attributes.externalUrl == null
    )

    if (!mangadexChapter) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Content is licensed or not found."
      })
    }

    if (mangadexChapter.attributes.pages == chapter.pages.length) {
      return chapter
    }

    const { error: downloadError } = await throwable(
      ChapterService.downloadChapter(
        input.slug_url,
        String(chapter.id),
        mangadexChapter.id
      )
    )

    if (downloadError) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" })
    }

    return chapter
  })
})

export type Chapter = RouterOutput["list"][number]
