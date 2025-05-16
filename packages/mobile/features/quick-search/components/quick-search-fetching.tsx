import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { FadeView } from "@/components/ui/fade-view"

import { useQuickSearch } from "@/features/quick-search/api/use-quick-search"
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated"

export const QuickSearchFetching = ({
  q,
  live,
}: {
  q: string
  live: string
}) => {
  const { isFetching } = useQuickSearch(q)

  const keyboard = useAnimatedKeyboard()

  const kbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 2.5 }],
  }))

  if (isFetching || (q != live && live)) {
    return (
      <FadeView
        withEnter
        className="absolute items-center justify-center flex-1 top-1/2 w-full"
        style={[kbStyle]}
      >
        <ActivityIndicator />
      </FadeView>
    )
  }
}
