import { Hono } from "hono";
import { Mangadex } from "const/api";

import { ChapterService, mangaService } from "services";

import { ChapterControllerValidation } from "types/zod";

import axios from "axios";

import { throwable } from "lib/utils";
import { api } from "lib/axios";

import { queryFields } from "const/query-fields";

import { MangaSchema } from "types/zod";

const app = new Hono();

app.get("/", async (c) => {
  const { q, page } = c.req.query();
  const genres = c.req.queries("genres[]");

  return c.json(await mangaService.getMangaWithQueries(q, genres, page));
});

app.get("/:slug_url", async (c) => {
  const { slug_url } = c.req.param();

  if (!slug_url) {
    return c.json({
      data: null,
      error: "Slug is not provided",
    });
  }

  const exists = await mangaService.getManga(slug_url);

  if (exists) {
    return c.json({
      data: exists,
    });
  }

  const manga = await api.get(`/manga/${slug_url}?${queryFields.manga}`);

  const { data, error } = await throwable(() =>
    MangaSchema.parse(manga.data.data)
  );

  if (error) {
    return c.json({
      data: null,
      error: "Invalid site id",
    });
  }

  const newManga = await mangaService.createManga(data!);

  await ChapterService.createChaptersFromRemote(slug_url);

  return c.json(
    {
      data: newManga,
    },
    newManga == null ? 400 : 200
  );
});

app.get("/:slug_url/chapters", async (c) => {
  const { slug_url } = c.req.param();
  const { action } = c.req.query();

  if (action == "create") {
    return c.json({
      data: await ChapterService.createChaptersFromRemote(slug_url),
    });
  }

  return c.json({
    data: await ChapterService.getChapters(slug_url),
  });
});

app.get("/:slug_url/chapter", async (c) => {
  const { slug_url } = c.req.param();
  const query = c.req.query();

  const manga = await mangaService.getManga(slug_url);

  const data = ChapterControllerValidation.query.parse(query);

  if (!manga) {
    return c.json(
      {
        message: "Manga not found",
      },
      404
    );
  }

  const { data: chapter, error } = await throwable(
    ChapterService.getChapter(slug_url, data.number, data.volume)
  );

  if (error) {
    return c.json(
      {
        message: "Chapter not found",
      },
      404
    );
  }

  const id = (await axios.get(Mangadex.search(manga.eng_name!))).data.data[0]
    .id;

  const {
    data: { data: chapters },
  } = await axios.get(Mangadex.chapters(id));

  const mangadexChapter = chapters.find(
    (mangadexChapter: {
      attributes: {
        volume: string;
        chapter: string;
        translatedLanguage: string;
      };
    }) =>
      mangadexChapter.attributes.volume == data.volume &&
      mangadexChapter.attributes.chapter == data.number &&
      mangadexChapter.attributes.translatedLanguage == "en"
  );

  const { error: downloadError } = await throwable(
    ChapterService.downloadChapter(String(chapter!.id), mangadexChapter.id)
  );

  if (downloadError) {
    return c.json(
      {
        message: "Chapter not found",
      },
      404
    );
  }

  return c.json({
    data: chapter,
  });
});

export const mangaController = app;
