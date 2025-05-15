import { Manga, RelatedReason } from "~/lib/prisma";

import { Item } from "~/types/zod/manga";
import { PaginatedResponse } from "~/types/zod/paginated-response";

import { db } from "~/lib/db";
import { Logger } from "~/lib/logger";

import { pageLimit } from "~/const/db";
import { translate } from "~/services/translate.service";
import { CatalogSearchFormData } from "~/types/zod";

const MangaLogger = new Logger("MangaService");

class Service {
  public async getManga(slug_url: string) {
    const data = await db.manga.findFirstOrThrow({
      where: {
        slug_url,
        model: "manga",
      },
      include: {
        cover: true,
        genres: true,
        items_count: true,
        ageRestriction: true,
        background: true,
      },
    });

    return data;
  }

  public async createManga(data: Item) {
    const eng_name = data.eng_name ?? data.name;
    const summary = await translate(data.summary!);

    await Promise.all(
      data.genres.map(
        async (genre) =>
          await db.genre.upsert({
            where: { id: genre.id },
            update: {},
            create: genre,
          })
      )
    );

    await db.manga
      .create({
        data: {
          id: data.id,
          name: data.name,
          slug_url: data.slug_url,
          eng_name,
          model: data.model,
          otherNames: data.otherNames,
          summary,
          cover: {
            create: {
              ...data.cover,
            },
          },
          ageRestriction: {
            connectOrCreate: {
              where: {
                id: data.ageRestriction.id,
              },
              create: {
                id: data.ageRestriction.id,
                label: data.ageRestriction.label,
              },
            },
          },
          items_count: {
            create: {
              uploaded: data.items_count.uploaded,
            },
          },
          site: data.site,
          genres: {
            connect: data.genres.map((genre) => ({ id: genre.id })),
          },
          background: {
            create: {
              url: data.background.url,
            },
          },
        },
      })
      .catch((error) => {
        MangaLogger.error("Failed to create manga record", error);
      });

    return this.getManga(data.slug_url);
  }

  public async getTitles(page?: string) {
    const p = (page != undefined ? Number(page) - 1 : 0) * pageLimit;
    const nextPage = (page != undefined ? Number(page) : 0) * pageLimit;

    const data = await db.manga.findMany({
      skip: p,
      take: pageLimit,
      orderBy: {
        id: "asc",
      },
      include: {
        cover: true,
        Chapter: {
          omit: {
            count: true,
          },
          orderBy: {
            item_number: "asc",
          },
          take: 1,
        },
      },
    });

    const nextPageData = await db.manga.count({
      skip: nextPage,
      take: pageLimit,
      orderBy: {
        id: "asc",
      },
    });

    return {
      data: data.map((manga) => {
        const { Chapter, ...rest } = manga;

        return {
          ...rest,
          metadata: {
            last_item: Chapter[0],
          },
        };
      }),
      meta: {
        current_page: page ? Number(page) : 1,
        per_page: pageLimit,
        has_next_page: nextPageData > 1,
      },
    };
  }

  public async getMangaWithQueries(params: CatalogSearchFormData) {
    const p = (params.cursor - 1) * pageLimit;
    const nextPage = params.cursor * pageLimit;

    const genresFilters =
      params.genres?.map((genreId) => ({
        genres: {
          some: {
            id: genreId,
          },
        },
      })) ?? [];

    const nextPageData = await db.manga.count({
      skip: nextPage,
      take: pageLimit,
      orderBy: {
        id: "asc",
      },
    });

    return {
      data: await db.manga.findMany({
        skip: p,
        take: pageLimit,
        include: {
          cover: true,
          ageRestriction: {
            omit: {
              site_ids: true,
            },
          },
          genres: {
            omit: {
              site_ids: true,
            },
          },
        },
        where: {
          model: "manga",
          AND: [
            ...genresFilters,
            {
              OR: [
                {
                  name: {
                    mode: "insensitive",
                    contains: params.q,
                  },
                },
                {
                  eng_name: {
                    mode: "insensitive",
                    contains: params.q,
                  },
                },
              ],
            },
          ],
        },
      }),
      meta: {
        current_page: params.cursor,
        per_page: pageLimit,
        has_next_page: nextPageData > 1,
      },
    };
  }
}

export const mangaService = new Service();
