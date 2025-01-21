import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export const useChapter = (slug_url: string, volume: string, number: string) => {
  return useQuery({
    queryKey: ["manga-chapter-reader", slug_url, volume, number],
    queryFn: async () =>
      (await api.get(`/manga/${slug_url}/chapter?volume=${volume}&number=${number}`)).data
        .data,
  });
};
