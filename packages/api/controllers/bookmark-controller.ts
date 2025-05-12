import { Hono } from "hono";

import { auth } from "lib/auth";
import { Unauthorized } from "lib/http-errors";

import { zValidator } from "@hono/zod-validator";

import bookmarksService from "services/bookmarks-service";
import { deleteBookmarkSchema, bookmarkSchema, updateBookmarkSchema } from "types/zod/bookmark";
import { throwable } from "lib/utils";
import { User } from "better-auth";
import { BookmarkName } from "@prisma/client";

const app = new Hono<{ Variables: { user: User } }>();

app.use(async (c, next) => {
  const data = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!data) {
    throw new Unauthorized();
  }

  c.set("user", data.user);

  await next();
});

app.get("/", async (c) => {
  const type = c.req.header("site-id") == "5" ? "anime" : "manga";

  const slug_url = c.req.query("slug_url");

  const name = c.req.query("name") as BookmarkName;

  const data = c.get("user");

  if (slug_url) {
    const bookmark = await bookmarksService.getBookmark(data.id, {
      slug_url,
      type,
    });

    return c.json({ bookmark });
  }

  const bookmarks = await bookmarksService.getBookmarks({
    userId: data.id,
    type,
    name,
  });

  return c.json({ bookmarks });
});

app.post("/", zValidator("json", bookmarkSchema), async (c) => {
  const { name, type, slug_url, chapterIndex, episodeIndex } = c.req.valid("json");

  const data = c.get("user");

  const { error } = await throwable(
    bookmarksService.createBookmark({
      userId: data.id,
      name,
      type,
      slug_url,
      chapterIndex,
      episodeIndex,
    })
  );

  if (error) {
    return c.json(
      {
        error,
      },
      400
    );
  }

  return c.json(
    {
      message: "Created!",
    },
    201
  );
});

app.put("/", zValidator("json", updateBookmarkSchema), async (c) => {
  const data = c.req.valid("json");

  const user = c.get("user");

  const bookmark = await bookmarksService.updateBookmark(user.id, data);

  return c.json({ bookmark });
});

app.delete("/", zValidator("query", deleteBookmarkSchema), async (c) => {
  const data = c.req.valid("query");

  const user = c.get("user");

  const bookmark = await bookmarksService.deleteBookmark(user.id, data);

  return c.json({ bookmark });
});

export const bookmarkController = app;
