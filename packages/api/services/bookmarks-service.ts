import { BookmarkName, ModelName } from "~/lib/prisma";
import { TRPCError } from "@trpc/server";
import { User } from "better-auth";

import { db } from "~/lib/db";
import {
  CreateBookmarkData,
  DeleteBookmarkData,
  UpdateBookmarkData,
} from "~/types/zod/bookmark";

class Service {
  public async getBookmark(
    userId: User["id"],
    data: {
      slug_url: string;
      type: ModelName;
    }
  ) {
    return await db.bookmark
      .findFirstOrThrow({
        where: {
          userId,
          type: data.type,
          OR: [
            {
              animeSlug_url: data.slug_url,
            },
            {
              mangaSlug_url: data.slug_url,
            },
          ],
        },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This bookmark doesn't exist",
        });
      });
  }

  public async getBookmarks(data: {
    userId: User["id"];
    type: ModelName;
    name?: BookmarkName;
  }) {
    const bookmarks = await db.bookmark.findMany({
      where: {
        userId: data.userId,
        type: data.type,
        mark: data.name ?? undefined,
      },
      include: {
        anime: {
          include: {
            cover: true,
          },
        },
        manga: {
          include: {
            cover: true,
          },
        },
        lastRead: true,
        lastWatch: true,
      },
      omit: {
        chapterId: true,
        episodeId: true,
        userId: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return bookmarks
      .map((bookmark) => {
        const {
          lastRead,
          lastWatch,
          animeSlug_url,
          mangaSlug_url,
          manga,
          anime,
          ...rest
        } = bookmark;

        const media = anime ?? manga;

        return {
          ...rest,
          media,
          last_seen: lastRead ?? lastWatch,
          slug_url: animeSlug_url ?? mangaSlug_url,
        };
      })
      .filter((item) => item.media !== null);
  }

  public async getLatestBookmarks(data: {
    userId: User["id"];
    type: ModelName;
  }) {
    return await db.bookmark.findMany({
      where: {
        ...data,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  private async createMangaBookmarkWithChapter(
    data: CreateBookmarkData & { userId: User["id"] }
  ) {
    const chapter = await db.chapter
      .findFirstOrThrow({
        where: {
          manga: {
            slug_url: data.slug_url,
          },
          item_number: data.chapterIndex,
        },
      })
      .catch(() => {
        throw "Chapter not found";
      });

    return await db.bookmark.create({
      data: {
        type: data.type,
        userId: data.userId,
        mark: data.name,
        mangaSlug_url: data.slug_url,
        chapterId: chapter.id,
      },
    });
  }

  private async createMangaBookmark(
    data: CreateBookmarkData & { userId: User["id"] }
  ) {
    return await db.bookmark.create({
      data: {
        type: data.type,
        userId: data.userId,
        mark: data.name,
        mangaSlug_url: data.slug_url,
      },
    });
  }

  private async createAnimeBookmarkWithEpisode(
    data: CreateBookmarkData & { userId: User["id"] }
  ) {
    const episode = await db.episode
      .findFirstOrThrow({
        where: {
          anime: {
            slug_url: data.slug_url,
          },
          item_number: data.episodeIndex,
        },
      })
      .catch(() => {
        throw "Episode not found";
      });

    return await db.bookmark.create({
      data: {
        type: data.type,
        userId: data.userId,
        mark: data.name,
        animeSlug_url: data.slug_url,
        episodeId: episode.id,
      },
    });
  }

  private async createAnimeBookmark(
    data: CreateBookmarkData & { userId: User["id"] }
  ) {
    return await db.bookmark.create({
      data: {
        type: data.type,
        userId: data.userId,
        mark: data.name,
        animeSlug_url: data.slug_url,
      },
    });
  }

  public async createBookmark(
    data: CreateBookmarkData & { userId: User["id"] }
  ) {
    const exists = await db.bookmark.findFirst({
      where: {
        OR: [
          {
            animeSlug_url: data.slug_url,
          },
          {
            mangaSlug_url: data.slug_url,
          },
        ],
        userId: data.userId,
      },
    });

    if (exists) {
      return await this.updateBookmark(data.userId, {
        ...data,
        id: exists.id,
      });
    }

    if (data.type == "manga") {
      if (Number.isInteger(data.chapterIndex)) {
        return await this.createMangaBookmarkWithChapter(data);
      } else {
        return await this.createMangaBookmark(data);
      }
    } else {
      if (data.episodeIndex) {
        return await this.createAnimeBookmarkWithEpisode(data);
      } else {
        return await this.createAnimeBookmark(data);
      }
    }
  }

  public async updateBookmark(userId: User["id"], data: UpdateBookmarkData) {
    const { id, name } = data;

    const bookmark = await db.bookmark
      .findFirstOrThrow({
        where: {
          id,
          userId,
        },
      })
      .catch(() => {
        throw "Bookmark not found";
      });

    if (bookmark.type == "manga") {
      const chapter = await db.chapter
        .findFirstOrThrow({
          where: {
            manga: {
              slug_url: bookmark.mangaSlug_url!,
            },
            item_number: data.chapterIndex,
          },
        })
        .catch(() => {
          throw "Chapter not found";
        });

      await db.bookmark.update({
        data: {
          mark: name,
          episodeId: null,
          chapterId: chapter.id,
          updatedAt: new Date(),
        },
        where: {
          id,
        },
      });
    } else {
      const episode = await db.episode
        .findFirstOrThrow({
          where: {
            anime: {
              slug_url: bookmark.animeSlug_url!,
            },
            item_number: data.episodeIndex,
          },
        })
        .catch(() => {
          throw "Episode not found";
        });

      await db.bookmark.update({
        data: {
          mark: name,
          chapterId: null,
          episodeId: episode.id,
          updatedAt: new Date(),
        },
        where: {
          id,
        },
      });
    }

    return bookmark;
  }

  public async deleteBookmark(userId: User["id"], data: DeleteBookmarkData) {
    return await db.bookmark
      .delete({
        where: {
          id: Number(data.id),
          userId,
        },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This bookmark doesn't exist",
        });
      });
  }
}

export default new Service();
