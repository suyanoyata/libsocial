import { ContentCollectionView } from "@/components/ui/content-collection-view"
import { Episode } from "@/features/title/components/episode-item"

import { useEpisodesAPI } from "@/features/title/api/use-episodes-api"
import { useMemo, useState } from "react"

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response"
import { View } from "react-native"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

export const TitleEpisodes = ({
  slug_url,
  site,
}: {
  slug_url: string
  site: number
}) => {
  const { data, isPending } = useEpisodesAPI(slug_url)

  const [descending, setDescending] = useState(false)

  const episodes = useMemo(() => {
    return descending ? data?.toReversed() : data
  }, [descending, data])

  const keyExtractor = (item: TitleEpisodeBase) => item.id.toString()

  const renderItem = ({ item }: { item: TitleEpisodeBase }) => (
    <Episode slug_url={slug_url} episode={item} index={item.item_number} />
  )

  if (!data && isPending) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
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
