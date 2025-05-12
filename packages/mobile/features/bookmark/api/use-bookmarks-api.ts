import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"

import { useProperties } from "@/store/use-properties"

import { Bookmark } from "@/features/bookmark/types/bookmark"

export const useBookmarksAPI = (filter?: string) => {
  const siteId = useProperties((state) => state.siteId)

  return useQuery({
    queryKey: ["bookmarks", siteId, filter],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filter) {
        params.append("name", filter)
      }

      const {
        data: { bookmarks },
      } = await api.get<{ bookmarks: Bookmark[] }>(`/bookmarks?${params}`)

      return bookmarks
    },
  })
}
