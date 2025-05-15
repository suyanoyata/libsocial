import { ContentCollectionView } from "@/components/ui/content-collection-view"
import { Chapter } from "@/features/title/components/chapter-item"

import { useChapters } from "@/features/title/api/use-chapters"
import { useMemo, useState } from "react"

import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { View } from "react-native"

import withBubble from "@/components/ui/withBubble"
import { Icon as _Icon } from "@/components/icon"

import { FadeView } from "@/components/ui/fade-view"
import { Text } from "@/components/ui/text"

import type { Chapter as ChapterType } from "api/router/chaptersRouter"

export const TitleChapters = ({ slug_url }: { slug_url: string }) => {
  const { data, isPending, isError } = useChapters(slug_url)

  const [descending, setDescending] = useState(false)

  const chapters = useMemo(() => {
    return descending ? data?.toReversed() : data
  }, [descending, data])

  const renderItem = ({ item }: { item: ChapterType }) => (
    <Chapter index={item.item_number - 1} slug_url={slug_url} chapter={item} />
  )

  const keyExtractor = (item: ChapterType) => item.id.toString()

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
      estimatedItemSize={45}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      descending={descending}
      title={`${data?.length} Chapters`}
      data={chapters}
      reverseCallback={() => setDescending((prev) => !prev)}
    />
  )
}
