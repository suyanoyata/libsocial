import { TRPCError } from "@trpc/server";
import { db } from "~/lib/db";
import { mangaService } from "~/services";
import { animeService } from "~/services";
import { CreateRelationData, CreateSimilarData } from "~/types/zod";

class Service {
  public async addRelatedTitle(data: CreateRelationData) {
    const [title, related] = await db
      .$transaction([
        db[data.type as "manga"].findFirstOrThrow({
          where: {
            slug_url: data.slug_url,
            site: data.type == "manga" ? 1 : 5,
          },
        }),
        db[data.type as "manga"].findFirstOrThrow({
          where: {
            slug_url: data.related.slug_url,
            site: data.type == "manga" ? 1 : 5,
          },
        }),
      ])
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Title or related title not found",
        });
      });

    const modelName = data.type.charAt(0).toUpperCase() + data.type.slice(1);

    await db.association.create({
      data: {
        relatedReason: data.related.reason,
        [`related${modelName}`]: {
          connect: {
            slug_url: related.slug_url,
          },
        },
        [data.type]: {
          connect: {
            slug_url: title.slug_url,
          },
        },
      },
    });

    if (data.type == "manga") {
      return await mangaService.getManga(related.slug_url);
    } else {
      return await animeService.getAnime(related.slug_url);
    }
  }

  public async addSimilarTitle(data: CreateSimilarData) {
    const [title, similar] = await db
      .$transaction([
        db[data.type as "manga"].findFirstOrThrow({
          where: {
            slug_url: data.slug_url,
            site: data.type == "manga" ? 1 : 5,
          },
        }),
        db[data.type as "manga"].findFirstOrThrow({
          where: {
            slug_url: data.similar.slug_url,
            site: data.type == "manga" ? 1 : 5,
          },
        }),
      ])
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Title or related title not found",
        });
      });

    const modelName = data.type.charAt(0).toUpperCase() + data.type.slice(1);

    await db.association.create({
      data: {
        similarReason: data.similar.reason,
        [`similar${modelName}`]: {
          connect: {
            slug_url: similar.slug_url,
          },
        },
        [data.type]: {
          connect: {
            slug_url: title.slug_url,
          },
        },
      },
    });

    if (data.type == "manga") {
      return await mangaService.getManga(similar.slug_url);
    } else {
      return await animeService.getAnime(similar.slug_url);
    }
  }

  public async getSimilar(type: string, slug_url: string) {
    const data = await db.association.findMany({
      where: {
        [type == "manga" ? "manga_slug" : "anime_slug"]: slug_url,
      },
      omit: {
        id: true,
      },
      include: {
        similarManga: {
          include: {
            cover: true,
          },
        },
        similarAnime: {
          include: {
            cover: true,
          },
        },
      },
    });

    return data
      .map((item) => ({
        reason: item.similarReason,
        media: item.similarAnime ?? item.similarManga,
      }))
      .filter((item) => item.media !== null);
  }

  public async getRelations(type: string, slug_url: string) {
    const data = await db.association.findMany({
      where: {
        [type == "manga" ? "manga_slug" : "anime_slug"]: slug_url,
      },
      omit: {
        id: true,
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
        reason: item.relatedReason,
        media: item.relatedAnime ?? item.relatedManga,
      }))
      .filter((item) => item.media !== null);
  }
}

export const associationService = new Service();
