import { db } from "~/lib/db";
import { RelatedReason } from "@prisma/client";
import { mangaService } from "~/services";
import { animeService } from "~/services";

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

  public async addRelatedTitle(
    slug_url: string,
    type: string,
    related: {
      slug_url: string;
      reason: RelatedReason;
    }
  ) {
    const title = await db[type as "manga"].findFirst({
      where: {
        slug_url,
        site: type == "manga" ? 1 : 5,
      },
    });

    const relatedTitle = await db[type as "manga"].findFirst({
      where: {
        slug_url: related.slug_url,
        site: type == "manga" ? 1 : 5,
      },
    });

    if (!related || !relatedTitle) {
      throw "Manga or related manga doesn't exist";
    }

    await db.related.create({
      data: {
        reason: related.reason,
        [type]: {
          connect: { slug_url: title?.slug_url },
        },
        [`related${
          String(type).charAt(0).toUpperCase() + String(type).slice(1)
        }`]: {
          connect: { slug_url: relatedTitle.slug_url },
        },
      },
    });

    if (type == "manga") {
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

    return data.map((item) => ({
      reason: item.reason,
      media: item.relatedAnime ?? item.relatedManga,
    }));
  }
}

export const relationService = new Service();
