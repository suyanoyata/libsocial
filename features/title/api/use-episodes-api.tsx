import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response";

export const useEpisodesAPI = (slug_url: string, site: number) => {
  return useQuery<TitleEpisodeBase[]>({
    queryKey: ["episodes", slug_url],
    queryFn: async () => {
      const { data } = await api.get(`/episodes?anime_id=${slug_url}`);

      return data;
    },
    enabled: !!site && site == 5 && !!slug_url,
  });
};
