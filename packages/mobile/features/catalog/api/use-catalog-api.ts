import { useInfiniteQuery } from "@tanstack/react-query"

import { useFilterStore } from "@/features/catalog/store/use-filter-store"
import { useProperties } from "@/store/use-properties"

import { trpc } from "@/lib/trpc"

export const useCatalogAPI = (query: string) => {
  const { genres } = useFilterStore()
  const { siteId } = useProperties()

  return useInfiniteQuery(
    trpc.catalog.list.infiniteQueryOptions(
      {
        q: query,
        genres,
        _s: siteId,
      },
      {
        staleTime: 1000 * 60 * 1,
        getNextPageParam: (lastPage) => {
          if (lastPage.meta.has_next_page) {
            return lastPage.meta.current_page + 1
          }
          return undefined
        },
      }
    )
  )
}
