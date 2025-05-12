import { useInfiniteQuery } from "@tanstack/react-query"

import { BaseTitle } from "@/features/shared/types/title"
import { useFilterStore } from "@/features/catalog/store/use-filter-store"
import { api } from "@/lib/axios"
import { useProperties } from "@/store/use-properties"

export const useCatalogAPI = (query: string) => {
  const { genres } = useFilterStore()
  const { siteId } = useProperties()

  return useInfiniteQuery<{
    data: BaseTitle[]
  }>({
    queryKey: ["catalog-search", query.trim(), genres],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()

      genres.forEach((genre) => {
        params.append("genres[]", String(genre))
      })

      const { data } = await api.get(
        `/${
          siteId == "5" ? "anime" : "manga"
        }?${params}&page=${pageParam}&q=${query.trim()}`
      )

      return data
    },
    staleTime: 1000 * 60 * 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.length != 0 && allPages?.length < 10) {
        return allPages.length + 1
      }
      return undefined
    },
    refetchInterval: false,
  })
}
