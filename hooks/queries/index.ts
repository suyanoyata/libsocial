import { Episode } from "@/features/anime-player/types/Episode";
import { Anime } from "@/types/anime.type";

import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { MangaImageResponse } from "@/features/reader/types/manga-image";

const titleData = (slug_url: string, type?: "manga" | "anime") => {
  const titleType = type ? `${type}/` : "";
  return useQuery<Anime>({
    queryKey: ["title-data", `${titleType}${slug_url}`],
  });
};

const mangaReader = ({ slug_url, volume, number }: { slug_url: string; volume: number; number: number }) => {
  return useQuery<MangaImageResponse>({
    queryKey: ["manga-reader", slug_url, volume, number],
    queryFn: async () => {
      const response = await api.get(`/${slug_url}/chapter?number=${number}&volume=${volume}`, {
        withCredentials: true,
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!slug_url,
  });
};

const filterConstants = () => {
  return useQuery({
    queryKey: ["filters-constants"],
    queryFn: async () =>
      (
        await api.get(
          "/constants?fields[]=genres&fields[]=tags&fields[]=types&fields[]=scanlateStatus&fields[]=status&fields[]=format&fields[]=ageRestriction"
        )
      ).data.data,
  });
};

const firstLoadData = () => {
  return useQuery<{
    popular: Anime[];
  }>({
    queryKey: ["app-initial-main-page-data"],
    retry: false,
    queryFn: async () => (await api.get("/catalog")).data.data,
  });
};

const getRecentViewedTitle = (slug_url: string, model: string) => {
  return useQuery<Anime>({
    queryKey: ["recent-read-title", slug_url, model],
    queryFn: async () => {
      if (model == undefined || slug_url == undefined) {
        return null;
      }

      return api
        .get(`/${model}/${slug_url}?fields[]=eng_name&fields[]=metadata.count&fields[]=chap_count`)
        .then((res) => res.data.data);
    },
  });
};

export const Queries = {
  titleData,
  mangaReader,
  filterConstants,
  firstLoadData,
  getRecentViewedTitle,
};
