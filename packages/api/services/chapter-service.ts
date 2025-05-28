import { TRPCError } from "@trpc/server";
import axios from "axios";
import { imageDimensionsFromData } from "image-dimensions";
import { api } from "~/lib/axios";
import { db } from "~/lib/db";

import { FileController } from "~/lib/fs";
import { Logger } from "~/lib/logger";
import { posthog } from "~/lib/posthog";
import { Chapter } from "~/lib/prisma";
import { supabase } from "~/lib/supabase";

import { mangaService } from "~/services/manga-service";

import { MangadexChapterData } from "~/types/mangadex-chapter";
import {
  MangaBaseChapterSchema,
  MangaGetChapter,
  RemoteChapter,
} from "~/types/zod/chapter";

class Service {
  private ChapterServiceLogger = new Logger("ChapterService");

  private async getRemoteChapters(slug_url: string) {
    const data = (await api.get(`/manga/${slug_url}/chapters`)).data.data;

    return data.map((chapter: RemoteChapter) =>
      MangaBaseChapterSchema.parse({
        ...chapter,
        created_at: new Date(chapter.branches[0].created_at),
      }),
    );
  }

  public async getChapters(slug_url: string) {
    const manga = await db.manga.findUniqueOrThrow({
      where: {
        slug_url,
      },
    });

    const shouldDisplayEmpty = await posthog.isFeatureEnabled(
      "SHOULD_DISPLAY_EMPTY_CONTENT",
      "api",
      {
        personProperties: {
          slug_url,
          type: "manga",
        },
      },
    );

    if (shouldDisplayEmpty) {
      const chapters = await db.chapter.findMany({
        where: {
          manga_id: manga.id,
        },
        orderBy: {
          item_number: "asc",
        },
      });

      return chapters.map((chapter) => ({
        ...chapter,
      }));
    }

    const chapters = await db.chapter.findMany({
      where: {
        manga_id: manga.id,
        pages: {
          some: {
            url: {
              not: undefined,
            },
          },
        },
      },
      orderBy: {
        item_number: "asc",
      },
    });

    return chapters.map((chapter) => ({
      ...chapter,
    }));
  }

  public async getChapter(data: MangaGetChapter) {
    const manga = await db.manga
      .findUniqueOrThrow({
        where: {
          slug_url: data.slug_url,
        },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Manga was not found",
        });
      });

    const chapter = await db.chapter
      .findFirstOrThrow({
        where: {
          manga_id: manga.id,
          number: data.number,
          volume: data.volume,
        },
        include: {
          pages: {
            orderBy: {
              image: "asc",
            },
          },
        },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Can't find this content",
        });
      });

    return chapter;
  }

  public async createChaptersFromRemote(slug_url: string) {
    const data: RemoteChapter[] = await this.getRemoteChapters(slug_url);
    const manga = await mangaService.getManga(slug_url);

    if (!manga) {
      return null;
    }

    return await db.$transaction([
      db.chapter.createMany({
        data: data.map((chapter) => ({
          ...chapter,
          manga_id: manga.id!,
          slug: String(chapter.id),
        })),
        skipDuplicates: true,
      }),
    ]);
  }

  public async createPagesForChapter(chapterId: number) {
    await db.mangaPage.create({
      data: {
        ratio: 0,
        image: "",
        url: "",
        chapterId,
      },
    });
  }

  private async getChapterPagesFromDb(chapterId: string) {
    const chapter = await db.chapter.findFirst({
      select: {
        pages: true,
      },
      where: {
        id: Number(chapterId),
      },
    });

    return chapter?.pages.length || 0;
  }

  public async downloadChapter(
    slug_url: string,
    chapterId: string,
    chapterHash: string,
  ) {
    const {
      data: {
        chapter: { data: chapterData, hash: mangadexHash },
        baseUrl: chapterBaseUrl,
      },
    } = await axios.get<MangadexChapterData>(
      `https://api.mangadex.org/at-home/server/${chapterHash}`,
    );

    if (chapterData.length == 0) {
      this.ChapterServiceLogger.error(
        `Most likely ${chapterId} chapter is licensed or not found, aborting...`,
      );

      throw new Error("Chapter is licensed or not found");
    }

    await db.chapter.update({
      where: {
        id: Number(chapterId),
      },
      data: {
        count: chapterData.length,
      },
    });

    const base = chapterBaseUrl;

    const { error } = await supabase().storage.getBucket(slug_url);

    const { data: supabaseFileList, error: supabaseFileListError } =
      await supabase().storage.from(slug_url).list(`${chapterId}/`);

    const mangadexFileList = chapterData;

    if (error || supabaseFileListError) {
      await supabase()
        .storage.createBucket(slug_url, {
          public: true,
          allowedMimeTypes: ["image/*"],
        })
        .catch((e) => {
          console.error(e);
        });
    }

    const pagesInDb = await this.getChapterPagesFromDb(chapterId);

    if (
      !!supabaseFileList &&
      supabaseFileList.length == mangadexFileList.length &&
      pagesInDb == supabaseFileList.length
    ) {
      return "downloaded";
    }

    // in case we cleared up database, but files in storage remained, we should bind them back
    if (!!supabaseFileList && pagesInDb !== supabaseFileList.length) {
      const res = await Promise.all(
        supabaseFileList.map(async (file) => {
          const { data } = await supabase()
            .storage.from(slug_url)
            .download(`${chapterId}/${file.name}`);

          const bytes = await data!.bytes();

          const dimensions = imageDimensionsFromData(bytes);

          if (!dimensions) {
            throw new Error(`Failed to get dimensions for ${file.name}`);
          }

          const ratio = parseFloat(
            (dimensions.width / dimensions.height).toFixed(4),
          );

          return {
            chapterId: Number(chapterId),
            image: file.name,
            url: supabase()
              .storage.from(slug_url)
              .getPublicUrl(`${chapterId}/${file.name}`).data.publicUrl,
            ratio,
          };
        }),
      );

      return await db.mangaPage.createMany({
        data: res,
        skipDuplicates: true,
      });
    }

    const fileController = new FileController(mangadexHash);

    const filesToUpload = await fileController.readHashFolder();

    // if content on hash path doesnt have same length as chapter we download it
    if ((await fileController.readHashFolder()).length !== chapterData.length) {
      Promise.all([
        chapterData.map(async (image, index) => {
          const exists = await fileController.fileExists(image);

          if (!exists) {
            const file = await fetch(`${base}/data/${mangadexHash}/${image}`);

            const extension = image.split(".").pop();
            await fileController.writeFile(
              `${index + 1 <= 9 ? "0" : ""}${index + 1}.${extension}`,
              file,
            );
          }
        }),
      ]);
    }

    this.ChapterServiceLogger.log(
      `uploading ${filesToUpload.length}/${chapterData.length}`,
    );

    await Promise.all([
      filesToUpload.map(async (image) => {
        const file = Bun.file(`./dist/${mangadexHash}/${image}`);
        const byteArray = await file.bytes();

        const dimensions = imageDimensionsFromData(byteArray);

        if (!dimensions) {
          return;
        }

        await supabase()
          .storage.from(slug_url)
          .upload(`${chapterId}/${image}`, file)
          .catch((e) => {
            console.error("error while uploading", e);
          });

        await db.mangaPage
          .create({
            data: {
              chapterId: Number(chapterId),
              image,
              url: supabase()
                .storage.from(slug_url)
                .getPublicUrl(`${chapterId}/${image}`).data.publicUrl,
              ratio: parseFloat(
                (dimensions.width / dimensions.height).toFixed(4),
              ),
            },
          })
          .catch(() => {
            // logger.warn(`failed to create record for ${image}`);
          });
      }),
    ]);

    return "downloaded";
  }

  public async deleteChapter(chapterId: Chapter["id"]) {
    await db.chapter
      .findFirstOrThrow({
        where: {
          id: chapterId,
        },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter was not found",
        });
      });

    await Promise.all([
      supabase().storage.deleteBucket(String(chapterId)),
      db.chapter.update({
        where: { id: chapterId },
        data: { count: 0 },
      }),
      db.mangaPage.deleteMany({
        where: {
          chapterId,
        },
      }),
    ]);
  }
}

export const ChapterService = new Service();
