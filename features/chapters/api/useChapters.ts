import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import { Chapter } from "@/features/chapters/types/manga-chapter";

export const useChapters = (slug_url: string) => {
  return useQuery<Chapter[]>({
    queryKey: ["chapter-data", slug_url],

    queryFn: async () => {
      const response = await api.get(`/${slug_url}/chapters`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!slug_url,
  });
};
