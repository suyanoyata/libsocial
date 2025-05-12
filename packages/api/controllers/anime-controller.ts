import { Hono } from "hono";
import { api } from "lib/axios";

import { queryFields } from "const/query-fields";

import { animeService } from "services";
import { AnimeSchema } from "types/zod";

import { throwable } from "lib/utils";

const app = new Hono();

app.get("/", async (c) => {
  const { q, page } = c.req.query();
  const genres = c.req.queries("genres[]");

  return c.json(await animeService.getAnimeWithQueries(q, genres, page));
});

app.get("/:slug_url", async (c) => {
  const { slug_url } = c.req.param();

  if (!slug_url) {
    return c.json({
      data: null,
      error: "Slug is not provided",
    });
  }

  const exists = await animeService.getAnime(slug_url);

  if (exists) {
    return c.json({
      data: exists,
    });
  }

  const anime = await api.get(`/anime/${slug_url}?${queryFields.anime}`);

  const { data, error } = await throwable(() => AnimeSchema.parse(anime.data.data));

  if (error) {
    return c.json({
      data: null,
      error: "Invalid site id",
    });
  }

  const newAnime = await animeService.createAnime(data!);

  await animeService.createEpisodesFromRemote(data!.slug_url);

  return c.json(
    {
      data: newAnime,
    },
    newAnime == null ? 400 : 200
  );
});

export const animeController = app;
