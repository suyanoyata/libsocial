import type { Chapter as ChapterType } from "api/router/chaptersRouter"
import { useMemo, useState } from "react"
import { View } from "react-native"
import { useChapters } from "@/features/title/api/use-chapters"
import { Chapter } from "@/features/title/components/chapter-item"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { ContentCollectionView } from "@/components/ui/content-collection-view"

import { FullscreenError } from "@/components/ui/fullscreen-error"

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

  if (!data && isPending) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator lottie />
      </View>
    )
  }

  if (isError) {
    return (
      <FullscreenError shouldDisplayBack={false} fadeIn>
        Something went wrong
      </FullscreenError>
    )
  }

  if (data.length == 0) {
    return (
      <FullscreenError
        source={require("@/assets/lottie/duck.json")}
        className="absolute top-0 left-0 h-[90%] w-full"
        fadeIn
        shouldDisplayBack={false}
      >
        No chapters were uploaded yet
      </FullscreenError>
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
