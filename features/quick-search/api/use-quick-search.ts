import { BaseTitle } from "@/features/shared/types/title";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useQuickSearch = (q: string, signal?: AbortSignal) => {
  return useQuery<BaseTitle[]>({
    queryKey: ["quick-search", q],
    queryFn: async () => {
      if (!q) {
        return [];
      }
      return (
        await api.get(
          `/manga?fields[]=rate_avg&fields[]=rate&fields[]=releaseDate&q=${q}&site_id[]=1`,
          {
            signal,
          }
        )
      ).data.data;
    },
  });
};
