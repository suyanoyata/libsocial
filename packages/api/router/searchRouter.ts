import { t } from "~/lib/trpc";

import { animeService, mangaService } from "~/services";
import { catalogSearchSchema } from "~/types/zod";

export const searchRouter = t.router({
  quick: t.procedure.input(catalogSearchSchema).query(async ({ input }) => {
    // const remote = false;

    if (input.siteId == "5") {
      // if (remote) {
      //   const { data } = await api.get(`/anime?q=${input.q}&site_id[]=5`);

      //   return data;
      // }
      return await animeService.getAnimeWithQueries({
        siteId: "5",
        type: "anime",
        cursor: 1,
        q: input.q,
      });
    }

    // if (remote) {
    //   const { data } = await api.get(`/manga?q=${input.q}&site_id[]=1`);

    //   return data;
    // }

    return await mangaService.getMangaWithQueries({
      q: input.q,
      siteId: "1",
      type: "manga",
      cursor: 1,
    });
  }),
});
