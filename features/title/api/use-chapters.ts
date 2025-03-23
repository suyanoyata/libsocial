import { z } from "zod";
import { api } from "@/lib/axios";

import { useQuery } from "@tanstack/react-query";

import { Chapter } from "@/features/shared/types/chapter";
import { AllowedSiteIds } from "@/store/use-properties";

export const useChapters = (slug_url: string, site?: AllowedSiteIds) => {
  return useQuery<Chapter[]>({
    queryKey: ["chapters", slug_url],
    queryFn: async () => {
      return (await api.get(`/manga/${slug_url}/chapters`)).data.data;
    },
    enabled: site !== undefined && [1, 3].includes(Number(site)),
  });
};
