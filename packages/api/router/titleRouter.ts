import { inferRouterOutputs, TRPCError } from "@trpc/server"
import { z } from "zod"
import { queryFields } from "~/const/query-fields"
import { api } from "~/lib/axios"
import { AppRouter, t } from "~/lib/trpc"

import { throwable } from "~/lib/utils"
import { animeService, ChapterService, mangaService } from "~/services"
import { associationService } from "~/services/association-service"
import {
  AnimeSchema,
  createRelationSchema,
  createSimilarSchema,
  MangaSchema
} from "~/types/zod"

type RouterOutput = inferRouterOutputs<AppRouter>["titles"]

export const titleRouter = t.router({
  popular: t.procedure.query(async ({ ctx }) => {
    if (ctx.type == "anime") {
      return await animeService.getTitles()
    }

    return await mangaService.getTitles()
  }),
  relations: {
    list: t.procedure
      .input(z.object({ slug_url: z.string() }))
      .query(async ({ input, ctx }) => {
        return await associationService.getRelations(ctx.type, input.slug_url)
      }),
    add: t.protected.input(createRelationSchema).mutation(async ({ input, ctx }) => {
      if (ctx.user.isAnonymous) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anonymous users cannot add relations"
        })
      }

      return await associationService.addRelatedTitle(input)
    })
  },
  similar: {
    list: t.procedure
      .input(z.object({ slug_url: z.string() }))
      .query(async ({ input, ctx }) => {
        return await associationService.getSimilar(ctx.type, input.slug_url)
      }),
    add: t.protected.input(createSimilarSchema).mutation(async ({ input, ctx }) => {
      if (ctx.user.isAnonymous) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anonymous users cannot add similar titles"
        })
      }

      return await associationService.addSimilarTitle(input)
    })
  },
  get: {
    title: t.procedure
      .input(z.object({ slug_url: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.type == "anime") {
          const { data, error } = await throwable(animeService.getAnime(input.slug_url))

          console.log("start")

          if (error?.code == "NOT_FOUND") {
            const anime = await api
              .get(`/anime/${input.slug_url}?${queryFields.anime}`)
              .catch((e) => {
                throw new TRPCError({
                  code: "CONFLICT",
                  message: `Couldn't get anime data, ${e.message}`
                })
              })

            const { data, error } = await throwable(() =>
              AnimeSchema.parse(anime.data.data)
            )

            if (error) {
              throw new TRPCError(error)
            }

            const newAnime = await animeService.createAnime(data!)

            await animeService.createEpisodesFromRemote(input.slug_url)

            return newAnime
          }

          if (error) {
            throw new TRPCError(error)
          }

          return data
        }

        const { data, error } = await throwable(mangaService.getManga(input.slug_url))

        if (error?.code == "NOT_FOUND") {
          const manga = await api.get(`/manga/${input.slug_url}?${queryFields.manga}`)

          const { data, error } = await throwable(() =>
            MangaSchema.parse(manga.data.data)
          )

          if (error) {
            throw new TRPCError(error)
          }

          const newManga = await mangaService.createManga(data!)

          await ChapterService.createChaptersFromRemote(input.slug_url)

          return newManga
        }

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "This content was not found"
          })
        }

        return data
      })
  }
})

export type TitleRelatedItem = RouterOutput["relations"]["list"][number]
export type TitleSimilarItem = RouterOutput["similar"]["list"][number]
export type Title = RouterOutput["get"]["title"]
export type PopularTitle = RouterOutput["popular"]["data"][number]
