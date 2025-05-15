import { z } from "zod";
import { AppRouter, t } from "~/lib/trpc";

import bookmarksService from "~/services/bookmarks-service";

import { BookmarkName } from "~/lib/prisma";

import {
  bookmarkSchema,
  deleteBookmarkSchema,
  getBookmarkSchema,
  updateBookmarkSchema,
} from "~/types/zod/bookmark";

import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>["bookmarks"];

export const bookmarkRouter = t.router({
  list: t.protected
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      return await bookmarksService.getBookmarks({
        userId: ctx.user.id,
        type: ctx.type,
        name: input?.length !== 0 ? (input as BookmarkName) : undefined,
      });
    }),
  get: t.protected.input(getBookmarkSchema).query(async ({ input, ctx }) => {
    return await bookmarksService.getBookmark(ctx.user.id, input);
  }),
  create: t.protected.input(bookmarkSchema).mutation(async ({ input, ctx }) => {
    return await bookmarksService.createBookmark({
      userId: ctx.user.id,
      ...input,
    });
  }),
  update: t.protected
    .input(updateBookmarkSchema)
    .mutation(async ({ input, ctx }) => {
      return await bookmarksService.updateBookmark(ctx.user.id, input);
    }),
  delete: t.protected
    .input(deleteBookmarkSchema)
    .mutation(async ({ input, ctx }) => {
      return await bookmarksService.deleteBookmark(ctx.user.id, input);
    }),
});

export type BookmarkListItem = RouterOutput["list"][0];
export type BookmarkItem = RouterOutput["get"];
