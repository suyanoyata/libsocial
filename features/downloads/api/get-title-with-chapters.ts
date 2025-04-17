import { api } from "@/lib/axios";

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";

import { Title } from "@/features/shared/types/title";
import { Chapter } from "@/features/shared/types/chapter";

export const getTitleWithChapters = async (slug_url: string, chapter: Chapter) => {
  const {
    data: { data: title },
  } = await api.get<{ data: Title }>(`/manga/${slug_url}/`);

  const {
    data: { data: chapterData },
  } = await api.get<{ data: ReaderChapter }>(
    `/manga/${slug_url}/chapter?volume=${chapter.volume}&number=${chapter.number}`
  );

  return { title, chapterData };
};
