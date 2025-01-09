import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { SimilarTitle } from "@/features/title/types/similar";

export const useSimilarTitle = (slug_url: string) => {
  return useQuery<SimilarTitle[]>({
    queryKey: ["title-similar", slug_url],

    queryFn: async () => {
      const response = await api.get(`/${slug_url}/similar`);

      return response.data.data;
    },
    enabled: !!slug_url,
  });
};
