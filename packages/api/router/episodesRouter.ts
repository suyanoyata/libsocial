import { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { AppRouter, t } from "~/lib/trpc";

import { episodesService } from "~/services";

type RouterOutput = inferRouterOutputs<AppRouter>["episodes"];

export const episodesRouter = t.router({
  list: t.procedure.input(z.string()).query(async ({ input }) => {
    return await episodesService.getEpisodes(input);
  }),
  get: t.procedure.input(z.coerce.number()).query(async ({ input }) => {
    return await episodesService.getEpisode(input);
  }),
});

export type Episode = RouterOutput["list"][number];
