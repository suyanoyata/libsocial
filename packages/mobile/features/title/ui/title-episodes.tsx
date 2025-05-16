import { ContentCollectionView } from "@/components/ui/content-collection-view"
import { Episode } from "@/features/title/components/episode-item"

import { useEpisodesAPI } from "@/features/title/api/use-episodes-api"
import { useMemo, useState } from "react"

import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { View } from "react-native"

import type { Episode as EpisodeType } from "api/router/episodesRouter"
import { FullscreenError } from "@/components/ui/fullscreen-error"

export const TitleEpisodes = ({ slug_url }: { slug_url: string }) => {
  const { data, isPending, isError } = useEpisodesAPI(slug_url)

  const [descending, setDescending] = useState(false)

  const episodes = useMemo(() => {
    return descending ? data?.toReversed() : data
  }, [descending, data])

  const keyExtractor = (item: EpisodeType) => item.id.toString()

  const renderItem = ({ item }: { item: EpisodeType }) => (
    <Episode slug_url={slug_url} episode={item} index={item.item_number} />
  )

  if (!data && isPending) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator lottie />
      </View>
    )
  }

  if (isError) {
    return (
      <FullscreenError fadeIn shouldDisplayBack={false}>
        Something went wrong
      </FullscreenError>
    )
  }

  return (
    <ContentCollectionView
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      title={`${data?.length} Episodes`}
      data={episodes}
      estimatedItemSize={45}
      reverseCallback={() => setDescending((prev) => !prev)}
      descending={descending}
    />
  )
}
