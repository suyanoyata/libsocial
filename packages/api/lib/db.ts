import { PrismaClient } from "~/lib/prisma";

export const db = new PrismaClient({
  omit: {
    manga: {
      coverId: true,
      itemsCountId: true,
      ageRestrictionId: true,
      backgroundId: true,
    },
    cover: {
      id: true,
    },
    itemsCount: {
      id: true,
    },
    anime: {
      coverId: true,
      ageRestrictionId: true,
      backgroundId: true,
    },
    background: {
      id: true,
    },
    episode: {
      slug_url: true,
    },
    genre: {
      site_ids: true,
    },
    ageRestriction: {
      site_ids: true,
    },
    chapter: {
      manga_id: true,
      count: true,
    },
    mangaPage: {
      chapterId: true,
    },
  },
});
