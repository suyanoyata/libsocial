import { useQuery } from "@tanstack/react-query"

import { trpc } from "@/lib/trpc"

export const useEpisodesAPI = (slug_url: string) => {
  return useQuery(
    trpc.episodes.list.queryOptions(slug_url, {
      enabled: !!slug_url,
    })
  )
}
