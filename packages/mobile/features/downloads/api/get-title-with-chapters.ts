import { t } from "@/lib/trpc/trpc-client"

import { Chapter } from "@/features/shared/types/chapter"

export const getTitleWithChapters = async (
  slug_url: string,
  chapter: Chapter
) => {
  const [title, chapterData] = await Promise.all([
    t.titles.get.title.query({ slug_url, siteId: "1" }),
    t.chapters.get.query({
      slug_url,
      number: chapter.number,
      volume: chapter.volume,
    }),
  ])

  return { title, chapterData }
}
