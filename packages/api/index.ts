import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { trimTrailingSlash } from "hono/trailing-slash";

import { logger } from "hono/logger";
import { cors } from "hono/cors";

import constantController from "~/controllers/constant-controller";

import { episodesService, mangaService } from "~/services";

import {
  animeController,
  mangaController,
  bookmarkController,
} from "~/controllers";
import { animeService } from "~/services/anime-service";
import { throwable } from "~/lib/utils";

import { auth } from "~/lib/auth";
import { AnonymousForbidden, Unauthorized } from "~/lib/http-errors";
import { relationService } from "~/services/relation-service";

const app = new Hono().basePath("/api");

app.use(
  "/*",
  cors({
    origin: process.env.BETTER_AUTH_URL!,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

app.use(logger());
app.use(trimTrailingSlash());

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/", async (c) => {
  const siteId = c.req.header("Site-Id");

  if (siteId == "5") {
    const { data: popular } = await animeService.getTitles();

    return c.json({
      data: {
        popular,
      },
    });
  }

  const { data: popular } = await mangaService.getTitles();

  return c.json({
    data: {
      popular,
    },
  });
});

app.route("/constants", constantController);

app.get("/catalog", async (c) => {
  const { page } = c.req.query();

  return c.json({
    data: await mangaService.getTitles(page),
  });
});

app.get("/episodes/:episodeId?", async (c) => {
  const { anime_id } = c.req.query();

  const { episodeId } = c.req.param();

  if (episodeId) {
    const { data, error } = await throwable(
      episodesService.getEpisode(Number(episodeId))
    );

    if (error) {
      return c.json(
        {
          error: "Can't find episode",
        },
        {
          status: 404,
        }
      );
    }

    return c.json(data);
  }

  if (!anime_id) {
    return c.json(
      {
        error: "anime_id is not provided",
      },
      {
        status: 404,
      }
    );
  }

  const { data, error } = await throwable(
    episodesService.getEpisodes(anime_id)
  );

  if (error) {
    return c.json(
      {
        error: "Can't find episodes for this anime",
      },
      {
        status: 404,
      }
    );
  }

  return c.json(data);
});

app.route("/anime", animeController);
app.route("/manga", mangaController);
app.route("/bookmarks", bookmarkController);

app.post("/:type/:slug_url/relations", async (c) => {
  const { type, slug_url } = c.req.param();

  const data = await c.req.json();

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new Unauthorized();
  }

  if (session?.user.isAnonymous) {
    throw new AnonymousForbidden();
  }

  if (!slug_url) {
    return c.json(
      {
        data: null,
        error: "Slug is not provided",
      },
      400
    );
  }

  if (!data) {
    return c.json(
      {
        data: null,
        error: "Related is not provided",
      },
      400
    );
  }

  if (data.slug_url == slug_url) {
    return c.json(
      {
        data: null,
        error: "Related slug url can't be same as parent slug url",
      },
      400
    );
  }

  const relationExists = await relationService.checkRelationExistence(
    slug_url,
    data
  );

  if (relationExists) {
    return c.json(
      {
        data: null,
        error: "This relation already exists",
      },
      400
    );
  }

  const { data: manga, error } = await throwable(
    relationService.addRelatedTitle(slug_url, type, data)
  );

  if (error) {
    return c.json(
      {
        data: null,
        error,
      },
      400
    );
  }

  return c.json({
    data: manga,
  });
});

app.get("/:type/:slug_url/relations", async (c) => {
  const { type, slug_url } = c.req.param();
  const title = await relationService.getRelations(type, slug_url);

  return c.json({
    data: title,
  });
});

showRoutes(app);

export default app;
