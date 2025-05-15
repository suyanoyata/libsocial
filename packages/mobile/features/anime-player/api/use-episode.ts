import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

export const useEpisode = (episodeId?: number) => {
  return useQuery(
    trpc.episodes.get.queryOptions(episodeId!, { enabled: !!episodeId })
  )
}
