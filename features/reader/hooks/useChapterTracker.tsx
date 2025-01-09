import { useEffect } from "react";

import { storage, Storage } from "@/features/shared/lib/storage";

import { Chapter } from "@/features/chapters/types/manga-chapter";

import { Queries } from "@/hooks/queries";

import { MangaStorageItem } from "@/features/chapters/types/manga-storage-item";

export const useChapterTracker = (
  chapterIndex: number,
  chapters: Chapter[],
  slug_url: string
) => {
  const { data: titleData, refetch } = Queries.titleData(slug_url);

  useEffect(() => {
    if (!titleData) {
      refetch();
      return;
    }

    const title: MangaStorageItem = {
      slug_url: titleData.slug_url,
      lastReadChapter: chapterIndex + 1,
      chapters: chapters.length,
      model: titleData.model,
    };

    const titles = storage.getString(Storage.lastReadTitles);

    if (titles == "" || titles == undefined) {
      return storage.set(Storage.lastReadTitles, JSON.stringify([title]));
    }

    let parsedTitles = Array.isArray(JSON.parse(titles))
      ? JSON.parse(titles).toReversed()
      : [];

    const titleIndex = parsedTitles.findIndex(
      (t: any) => t.slug_url === title.slug_url
    );

    if (titleIndex == -1) {
      parsedTitles.push(title);
    }

    if (
      titleIndex != -1 &&
      parsedTitles[titleIndex].lastReadChapter < chapterIndex + 1
    ) {
      const filteredOutTitles = parsedTitles.filter(
        (t: any) => t.slug_url !== title.slug_url
      );
      parsedTitles = [...filteredOutTitles, title];
    }

    storage.set(
      Storage.lastReadTitles,
      JSON.stringify(parsedTitles.toReversed())
    );
  }, [slug_url, titleData]);
};
