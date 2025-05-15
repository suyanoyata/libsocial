import { inferRouterOutputs } from "@trpc/server";

import { t } from "~/lib/trpc";

import { titleRouter } from "~/router/titleRouter";
import { searchRouter } from "~/router/searchRouter";
import { catalogRouter } from "~/router/catalogRouter";
import { episodesRouter } from "~/router/episodesRouter";
import { chaptersRouter } from "~/router/chaptersRouter";
import { bookmarkRouter } from "~/router/bookmarkRouter";
import { constantsRouter } from "~/router/constantsRouter";

export const appRouter = t.router({
  titles: titleRouter,
  search: searchRouter,
  catalog: catalogRouter,
  episodes: episodesRouter,
  chapters: chaptersRouter,
  bookmarks: bookmarkRouter,
  constants: constantsRouter,
});

export type RouterOutput = inferRouterOutputs<typeof appRouter>;
