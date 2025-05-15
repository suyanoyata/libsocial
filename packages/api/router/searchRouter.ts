import { z } from "zod";
import { t } from "~/lib/trpc";

import { animeService, mangaService } from "~/services";
import { catalogSearchSchema } from "~/types/zod";

export const searchRouter = t.router({
  quick: t.procedure.input(catalogSearchSchema).query(async ({ input }) => {
    if (input.siteId == "5") {
      return await animeService.getAnimeWithQueries({
        siteId: "5",
        type: "anime",
        cursor: 1,
        q: input.q,
      });
    }

    return await mangaService.getMangaWithQueries({
      q: input.q,
      siteId: "1",
      type: "manga",
      cursor: 1,
    });
  }),
});
