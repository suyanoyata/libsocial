import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response";
import { api } from "@/lib/axios";
import { AllowedSiteIds } from "@/store/use-properties";
import { useQuery } from "@tanstack/react-query";

export const useEpisodesAPI = (slug_url: string, site: AllowedSiteIds = "5") => {
  return useQuery<TitleEpisodeBase[]>({
    queryKey: ["episodes", slug_url, site],
    queryFn: async () => {
      return (await api.get(`/episodes?anime_id=${slug_url}`)).data.data;
    },
    enabled: site && site == "5" && !!slug_url,
  });
};
