import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { AppRouter, t } from "~/lib/trpc";

import { z } from "zod";

import { animeService, mangaService } from "~/services";
import { relationService } from "~/services/relation-service";
import { createRelationSchema } from "~/types/zod";

type RouterOutput = inferRouterOutputs<AppRouter>["titles"];

export const titleRouter = t.router({
  popular: t.procedure.query(async ({ ctx }) => {
    if (ctx.type == "anime") {
      return await animeService.getTitles();
    }

    return await mangaService.getTitles();
  }),
  relations: {
    list: t.procedure
      .input(z.object({ slug_url: z.string() }))
      .query(async ({ input, ctx }) => {
        return await relationService.getRelations(ctx.type, input.slug_url);
      }),
    add: t.protected
      .input(createRelationSchema)
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.isAnonymous) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Anonymous users cannot add relations",
          });
        }

        return await relationService.addRelatedTitle(input);
      }),
  },
  get: {
    title: t.procedure
      .input(z.object({ slug_url: z.string(), siteId: z.string() }))
      .query(async ({ input }) => {
        if (input.siteId == "5") {
          return await animeService.getAnime(input.slug_url);
        }

        return await mangaService.getManga(input.slug_url);
      }),
  },
});

export type TitleRelatedItem = RouterOutput["relations"]["list"][0];
export type Title = RouterOutput["get"]["title"];
