import { RefreshControl, ScrollView, View } from "react-native"

import { useSession } from "@/features/auth/lib/auth"

import { useBookmarksAPI } from "@/features/bookmark/api/use-bookmarks-api"

import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import Animated, { FadeIn } from "react-native-reanimated"

export default function Bookmarks() {
  const { isPending } = useSession()

  const {
    data: bookmarks,
    isPending: isBookmarksPending,
    refetch,
  } = useBookmarksAPI()

  if (isPending || isBookmarksPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <Animated.View entering={FadeIn} className="pt-3 flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            tintColor="white"
          />
        }
        contentContainerClassName="gap-2 mx-2"
        className="flex-1"
      >
        {bookmarks?.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}
      </ScrollView>
    </Animated.View>
  )
}
