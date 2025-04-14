import { QueryClient } from "@tanstack/react-query";

import FastImage from "@d11/react-native-fast-image";

import { api } from "@/lib/axios";

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";
import { Chapter } from "@/features/shared/types/chapter";

export const preloadNextChapter = async (
  client: QueryClient,
  slug_url: string,
  nextChapter?: Chapter
) => {
  if (nextChapter?.volume && nextChapter?.number) {
    const {
      data: { data },
    } = await api.get<{ data: ReaderChapter }>(
      `/manga/${slug_url}/chapter?volume=${nextChapter.volume}&number=${nextChapter.number}`
    );

    client.setQueryData<ReaderChapter>(
      ["manga-chapter-reader", slug_url, nextChapter.volume, nextChapter.number],
      data
    );

    FastImage.preload(data.pages.map((page) => ({ uri: page.url })));
  }
};
