import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

import { Bookmark } from "@/features/bookmark/types/bookmark"
import { useSession } from "@/features/auth/lib/auth"

export const useBookmarkAPI = (query: { slug_url: string; type: string }) => {
  const { data } = useSession()
  return useQuery({
    queryKey: ["bookmark", query.slug_url],
    queryFn: async () => {
      const {
        data: { bookmark },
      } = await api.get<{ bookmark: Bookmark }>(
        `/bookmarks?slug_url=${query.slug_url}&type=${query.type}`
      )

      return bookmark
    },
    enabled: !!data,
  })
}
