import { useInfiniteQuery } from "@tanstack/react-query";

import { BaseTitle } from "@/features/shared/types/title";
import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { api } from "@/lib/axios";

export const useCatalogAPI = (query: string) => {
  const { genres, caution } = useFilterStore();

  return useInfiniteQuery<{
    data: BaseTitle[];
  }>({
    queryKey: ["catalog-search", query.trim(), genres, caution],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      let genreParams = genres.map((id) => `&genres[]=${id}`).join("");
      let cautionParams = caution.map((id) => `&caution[]=${id}`).join("");

      let call = `/manga?fields[]=rate&fields[]=rate_avg&fields[]=userBookmark&q=${query.trim()}&site_id[]=1&page=${pageParam}`;

      if (genreParams.length > 0) {
        call += genreParams;
      }

      if (cautionParams.length > 0) {
        call += cautionParams;
      }

      return (await api.get(call)).data;
    },
    staleTime: 1000 * 60 * 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.length != 0 && allPages?.length < 10) {
        return allPages.length + 1;
      }
      return undefined;
    },
    refetchInterval: false,
  });
};
