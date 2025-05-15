import { ContentCollectionView } from "@/components/ui/content-collection-view"
import { Episode } from "@/features/title/components/episode-item"

import { useEpisodesAPI } from "@/features/title/api/use-episodes-api"
import { useMemo, useState } from "react"

import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { View } from "react-native"

import { Icon as _Icon } from "@/components/icon"

import withBubble from "@/components/ui/withBubble"
import { FadeView } from "@/components/ui/fade-view"
import { Text } from "@/components/ui/text"

import type { Episode as EpisodeType } from "api/router/episodesRouter"

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

  const Icon = withBubble(_Icon)

  if (!data && isPending) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
    )
  }

  if (isError) {
    return (
      <FadeView withEnter className="items-center justify-center flex-1">
        <Icon name="Unplug" />
        <Text className="text-secondary font-medium mt-2">
          Something went wrong
        </Text>
      </FadeView>
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
