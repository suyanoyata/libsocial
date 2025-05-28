import { t } from "~/lib/trpc";
import { RouterOutput } from "~/router";

import { animeService, mangaService } from "~/services";

import { catalogSearchSchema } from "~/types/zod";

export const catalogRouter = t.router({
  list: t.procedure.input(catalogSearchSchema).query(async ({ ctx, input }) => {
    if (ctx.type == "anime") {
      return await animeService.getAnimeWithQueries(input);
    }

    return await mangaService.getMangaWithQueries(input);
  }),
});

export type CatalogItem = RouterOutput["catalog"]["list"]["data"][number];
