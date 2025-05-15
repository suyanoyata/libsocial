import { db } from "~/lib/db";
import { RelatedReason } from "@prisma/client";
import { mangaService } from "~/services";
import { animeService } from "~/services";
import { CreateRelationData } from "~/types/zod";

class Service {
  public async checkRelationExistence(
    slug_url: string,
    related: { slug_url: string }
  ) {
    const title = await db.related.findFirst({
      where: {
        OR: [
          {
            manga_slug: slug_url,
            relatedMangaSlug: related.slug_url,
          },
          {
            anime_slug: slug_url,
            relatedAnimeSlug: related.slug_url,
          },
        ],
      },
    });

    return !!title;
  }

  public async addRelatedTitle(data: CreateRelationData) {
    const title = await db[data.type as "manga"].findFirst({
      where: {
        slug_url: data.slug_url,
        site: data.type == "manga" ? 1 : 5,
      },
    });

    const relatedTitle = await db[data.type as "manga"].findFirst({
      where: {
        slug_url: data.related.slug_url,
        site: data.type == "manga" ? 1 : 5,
      },
    });

    if (!relatedTitle) {
      throw "Title or related title doesn't exist";
    }

    await db.related.create({
      data: {
        reason: data.related.reason,
        [data.type]: {
          connect: { slug_url: title?.slug_url },
        },
        [`related${
          String(data.type).charAt(0).toUpperCase() + String(data.type).slice(1)
        }`]: {
          connect: { slug_url: relatedTitle.slug_url },
        },
      },
    });

    if (data.type == "manga") {
      return await mangaService.getManga(relatedTitle.slug_url);
    } else {
      return await animeService.getAnime(relatedTitle.slug_url);
    }
  }

  public async getRelations(type: string, slug_url: string) {
    const data = await db.related.findMany({
      where: {
        [`${type}_slug`]: slug_url,
      },
      omit: {
        id: true,
        anime_slug: true,
        manga_slug: true,
        relatedAnimeSlug: true,
        relatedMangaSlug: true,
      },
      include: {
        relatedManga: {
          include: {
            cover: true,
          },
        },
        relatedAnime: {
          include: {
            cover: true,
          },
        },
      },
    });

    return data
      .map((item) => ({
        reason: item.reason,
        media: item.relatedAnime ?? item.relatedManga,
      }))
      .filter((item) => item.media !== null);
  }
}

export const relationService = new Service();
