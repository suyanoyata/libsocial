import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"
import { Chapter } from "@/features/shared/types/chapter"
import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter"

export const useChapter = (slug_url: string, chapter?: Chapter) => {
  return useQuery<ReaderChapter>({
    queryKey: [
      "manga-chapter-reader",
      slug_url,
      chapter?.volume,
      chapter?.number,
    ],
    queryFn: async () => {
      if (!chapter) throw new Error("No chapter is provided")

      return (
        await api.get(
          `/manga/${slug_url}/chapter?volume=${chapter.volume}&number=${chapter.number}`,
        )
      ).data.data
    },
    enabled: !!chapter,
  })
}
