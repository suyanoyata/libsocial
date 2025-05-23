import { QueryClient } from "@tanstack/react-query"

import FastImage from "@d11/react-native-fast-image"

import { Chapter } from "@/features/shared/types/chapter"
import { trpc } from "@/lib/trpc"
import { t } from "@/lib/trpc/trpc-client"
import { useProperties } from "@/store/use-properties"

export const preloadNextChapter = async (
  client: QueryClient,
  slug_url: string,
  nextChapter?: Chapter
) => {
  const didLoadNextChapter = !!client.getQueryData(
    trpc.chapters.get.queryKey({
      slug_url,
      volume: nextChapter?.volume,
      number: nextChapter?.number,
    })
  )

  if (didLoadNextChapter || useProperties.getState().celluar) return

  if (nextChapter?.volume && nextChapter?.number) {
    const data = await t.chapters.get.query({
      slug_url,
      volume: nextChapter.volume,
      number: nextChapter.number,
    })

    client.setQueryData(
      trpc.chapters.get.queryKey({
        slug_url,
        volume: nextChapter?.volume,
        number: nextChapter?.number,
      }),
      data
    )

    FastImage.preload(data.pages.map((page) => ({ uri: page.url })))
  }
}
