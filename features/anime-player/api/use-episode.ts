import { useAnimeStore } from "@/features/anime-player/context/anime-context";

import { TitleEpisode } from "@/features/title/types/title-episodes-response";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useEpisode = (episodeId?: number) => {
  const { slug_url } = useAnimeStore();

  return useQuery<TitleEpisode>({
    queryKey: ["episode", slug_url, episodeId],
    queryFn: async () => {
      const { data: episode } = await api.get<TitleEpisode>(`/episodes/${episodeId}`);

      return episode;
    },
    enabled: !!episodeId,
  });
};
