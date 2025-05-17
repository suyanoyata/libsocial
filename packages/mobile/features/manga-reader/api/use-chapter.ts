import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { Chapter } from "@/features/shared/types/chapter"

export const useChapter = (slug_url: string, chapter?: Chapter) => {
  return useQuery(
    trpc.chapters.get.queryOptions(
      { slug_url, ...chapter! },
      {
        enabled: !!chapter?.number && !!chapter?.volume && !!slug_url,
        refetchInterval(query) {
          if (!query.state.data) {
            return 1000 * 5
          }

          const data = query.state.data

          if (data.count != 0 && data.pages.length < data.count) {
            return 1000 * 5
          }

          if (data.pages.length == 0) {
            return 1000 * 5
          }

          return false
        },
      }
    )
  )
}
