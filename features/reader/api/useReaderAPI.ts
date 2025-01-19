import { RanobeChapter } from "@/features/reader/types/ranobe-chapter";
import { MangaImageResponse } from "@/features/reader/types/manga-image";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

type MediaType = "manga" | "ranobe";

type MediaResponseMap = {
  manga: MangaImageResponse;
  ranobe: RanobeChapter;
};

type Media<T extends MediaType> = T extends keyof MediaResponseMap ? MediaResponseMap[T] : never;

export const useReaderAPI = <T extends MediaType>(type: T, slug_url: string, volume: number, number: number) => {
  return useQuery<Media<T>>({
    queryKey: [`${type}-reader`, slug_url, volume, number],

    queryFn: async () => {
      const response = await api.get(`/${slug_url}/chapter?number=${number}&volume=${volume}`);
      if (response.data.data.pages.length == 0 || response.data.data.pages.length / response.data.data.count < 0.6) {
        throw new Error("No pages found");
      }
      return response.data.data as Media<T>;
    },

    staleTime: 1000 * 60 * 60,
    enabled: !!slug_url,
    retry: 10,
    retryDelay: 2000,
  });
};
