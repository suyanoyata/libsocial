import { useAnimeStore } from "@/features/anime-player/context/anime-context";

import { TitleEpisode } from "@/features/title/types/title-episodes-response";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useEpisode = (episodeId?: number) => {
  const { slug_url } = useAnimeStore();

  return useQuery<TitleEpisode>({
    queryKey: ["episode", slug_url, episodeId],
    queryFn: async () => {
      const episode: TitleEpisode = (await api.get(`/episodes/${episodeId}`)).data.data;
      const players = episode.players.filter((player) => player.player == "Animelib");

      return {
        ...episode,
        players,
      };
    },
    enabled: !!episodeId,
  });
};
