import { Episode } from "@/app/anime-watch";
import { RanobeChapter } from "@/app/ranobe-reader";
import { Chapter } from "@/components/manga-chapters";
import { api } from "@/lib/axios";
import { logger } from "@/lib/logger";
import { Anime } from "@/types/anime.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const titleData = (slug_url: string, type?: "manga" | "anime") => {
  const titleType = type ? `${type}/` : "";
  return useQuery<Anime>({
    queryKey: ["title-data", `${titleType}${slug_url}`],
  });
};

const animeEpisodes = (slug_url: string) => {
  return useQuery<Episode[]>({
    queryKey: ["anime-episodes", slug_url],
    queryFn: async () => {
      return await api
        .get(`/episodes?anime_id=${slug_url}`)
        .then((res) => res.data.data);
    },
  });
};

const chapters = (slug_url: string) => {
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

const mangaReader = ({
  slug_url,
  volume,
  number,
}: {
  slug_url: string;
  volume: number;
  number: number;
}) => {
  return useQuery<{
    pages: {
      url: string;
      ratio: number;
    }[];
  }>({
    queryKey: ["manga-reader", slug_url, volume, number],
    queryFn: async () => {
      const response = await api.get(
        `/${slug_url}/chapter?number=${number}&volume=${volume}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!slug_url,
  });
};

const ranobeChapter = ({
  slug_url,
  volume,
  number,
}: {
  slug_url: string;
  volume: number;
  number: number;
}) => {
  return useQuery<RanobeChapter>({
    queryKey: ["ranobe-reader", slug_url, volume, number],

    queryFn: async () => {
      const response = await api.get(
        `/${slug_url}/chapter?number=${number}&volume=${volume}`
      );
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

const currentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => await api.get("/auth/me").then((res) => res.data.data),
  });
};

const firstLoadData = () => {
  return useQuery<{
    popular: Anime[];
  }>({
    queryKey: ["app-initial-main-page-data"],
    retry: false,
    queryFn: async () => (await api.get("/")).data.data,
  });
};

const getBookmark = (type: string, slug_url: string) => {
  return useQuery({
    queryKey: ["bookmark", slug_url],
    queryFn: async () => {
      const response = await api.get(`/${type}/${slug_url}/bookmark`);
      return {
        id: response.data.data.id,
        status: response.data.data.status,
      };
    },
  });
};

const getRecentViewedTitle = (slug_url: string, model: string) => {
  return useQuery<Anime>({
    queryKey: ["recent-read-title", slug_url, model],
    queryFn: async () =>
      api
        .get(
          `/${model}/${slug_url}?fields[]=eng_name&fields[]=metadata.count&fields[]=chap_count`
        )
        .then((res) => res.data.data),
  });
};

export const Queries = {
  titleData,
  animeEpisodes,
  chapters,
  mangaReader,
  ranobeChapter,
  filterConstants,
  currentUser,
  firstLoadData,
  getBookmark,
  getRecentViewedTitle,
};
