import { t } from "~/lib/trpc";

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
