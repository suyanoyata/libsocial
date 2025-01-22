import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { Chapter } from "@/features/shared/types/chapter";
import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";

export const useChapter = (slug_url: string, volume: string, number: string) => {
  return useQuery<ReaderChapter>({
    queryKey: ["manga-chapter-reader", slug_url, volume, number],
    queryFn: async () =>
      (await api.get(`/manga/${slug_url}/chapter?volume=${volume}&number=${number}`)).data
        .data,
  });
};
