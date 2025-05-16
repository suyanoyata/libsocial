import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { Chapter } from "@/features/shared/types/chapter"

export const useChapter = (slug_url: string, chapter?: Chapter) => {
  return useQuery(
    trpc.chapters.get.queryOptions(
      { slug_url, ...chapter! },
      {
        enabled: !!chapter?.number && !!chapter?.volume && !!slug_url,
      }
    )
  )
}
