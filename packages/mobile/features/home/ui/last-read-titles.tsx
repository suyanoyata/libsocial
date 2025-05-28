import { useMemo } from "react"
import { View, ScrollView } from "react-native"

import Animated, { FadeIn } from "react-native-reanimated"

import { LastReadTitleCard } from "@/features/home/components/last-read-title-card"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import { useTitleReadChapter } from "@/store/use-chapters-tracker"
import { useProperties } from "@/store/use-properties"
import { useReadingTracker } from "@/store/use-reading-tracker"

export const LastReadTitles = () => {
  const { lastReadItems, reset } = useReadingTracker()
  const resetChapters = useTitleReadChapter((state) => state.reset)

  const { siteId } = useProperties()

  const visibleItems = useMemo(
    () => lastReadItems.filter((i) => i.hide == false),
    [lastReadItems]
  )

  if (visibleItems.length == 0 || siteId == "5") return null

  return (
    <Animated.View entering={FadeIn}>
      <View className="flex-row items-center justify-between mx-2 mt-3">
        <Text className="recent-viewed-title">You've stopped at</Text>
        <Button
          size="sm"
          onPress={() => {
            resetChapters()
            reset()
          }}
          iconLeft="Trash2"
          variant="destructive"
        >
          Clear all
        </Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mx-2 mt-4"
        contentContainerClassName="gap-4"
      >
        {lastReadItems.map((item) => (
          <LastReadTitleCard key={item.slug_url} item={item} />
        ))}
      </ScrollView>
    </Animated.View>
  )
}
