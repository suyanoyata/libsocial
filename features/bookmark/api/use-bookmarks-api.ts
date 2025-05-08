import { Bookmark } from "@/features/bookmark/types/bookmark"
import { api } from "@/lib/axios"
import { useProperties } from "@/store/use-properties"
import { useQuery } from "@tanstack/react-query"

export const useBookmarksAPI = () => {
  const siteId = useProperties((state) => state.siteId)

  return useQuery({
    queryKey: ["bookmarks", siteId],
    queryFn: async () => {
      const {
        data: { bookmarks },
      } = await api.get<{ bookmarks: Bookmark[] }>("/bookmarks")

      return bookmarks
    },
  })
}
