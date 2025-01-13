import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

import { VideoPlayerData } from "@/types/anime.type";

export const useEpisodeData = (episodeId: number) => {
  return useQuery<{
    players: VideoPlayerData[];
  }>({
    queryKey: ["episode-player", episodeId],
    queryFn: async () =>
      await api.get(`/episodes/${episodeId}`).then((res) => res.data.data),
  });
};
