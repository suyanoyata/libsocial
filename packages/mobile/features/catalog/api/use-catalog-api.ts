import { useInfiniteQuery } from "@tanstack/react-query"

import { BaseTitle } from "@/features/shared/types/title"
import { api } from "@/lib/axios"

import { useFilterStore } from "@/features/catalog/store/use-filter-store"
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

      if (query) {
        params.append("q", query)
      }

      if (pageParam) {
        params.append("page", String(pageParam))
      }

      const endpoint = siteId === "1" ? "manga" : "anime"

      const { data } = await api.get(`/${endpoint}?${params}`)

      return data
    },
    staleTime: 1000 * 60 * 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.length != 0 && allPages?.length < 10) {
        return allPages.length + 1
      }
      return undefined
    },
  })
}
