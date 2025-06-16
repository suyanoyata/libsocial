import { useQuery } from "@tanstack/react-query"

import { useSession } from "@/lib/auth"
import { trpc } from "@/lib/trpc"

export const useBookmarkAPI = (query: { slug_url: string; type: "anime" | "manga" }) => {
  const { data } = useSession()

  return useQuery(
    trpc.bookmarks.get.queryOptions(query, {
      refetchOnMount: false,
      refetchInterval: false,
      enabled: !!data,
      retry: false
    })
  )
}
