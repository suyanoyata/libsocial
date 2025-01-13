import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import { Episode } from "@/features/anime-player/types/Episode";

export const useAnimeEpisodes = (slug_url: string) => {
  return useQuery<Episode[]>({
    queryKey: ["anime-episodes", slug_url],
    queryFn: async () => {
      return await api
        .get(`/episodes?anime_id=${slug_url}`)
        .then((res) => res.data.data);
    },
  });
};
