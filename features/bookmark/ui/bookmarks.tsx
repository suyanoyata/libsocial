import { RefreshControl, ScrollView, View } from "react-native"

import { useSession } from "@/features/auth/lib/auth"

import { useBookmarksAPI } from "@/features/bookmark/api/use-bookmarks-api"

import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

import Animated, { FadeIn } from "react-native-reanimated"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import { Icon } from "@/components/icon"

import ContextMenu from "react-native-context-menu-view"

import withBubble from "@/components/ui/withBubble"
import { useState } from "react"
import { capitalize } from "@/lib/utils"

export default function Bookmarks() {
  const { isPending } = useSession()

  const [filter, setFilter] = useState("")

  const {
    data: bookmarks,
    isPending: isBookmarksPending,
    refetch,
  } = useBookmarksAPI(filter)

  const Bookmark = withBubble(Icon)

  const Comp = () => {
    if (isPending || isBookmarksPending) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      )
    }
    if (bookmarks?.length == 0) {
      return (
        <Animated.View
          entering={FadeIn}
          className="items-center justify-center flex-1 gap-2"
        >
          <Bookmark name="Bookmark" />
          <Text className="text-xl text-secondary font-bold text-center">
            {filter == ""
              ? "You have no bookmarks"
              : "You have no bookmarks of this kind"}
          </Text>
          <Text className="text-muted font-medium">
            You can add bookmark on title page
          </Text>
        </Animated.View>
      )
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        contentContainerClassName="gap-2 mx-2"
        className="flex-1"
      >
        {bookmarks?.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}
      </ScrollView>
    )
  }

  return (
    <Animated.View entering={FadeIn} className="pt-3 flex-1">
      <ContextMenu
        dropdownMenuMode
        disableShadow
        onPress={(e) => {
          const name = e.nativeEvent.name.toLowerCase()

          if (name == "all") {
            setFilter("")
          } else {
            setFilter(e.nativeEvent.name.toLowerCase())
          }
        }}
        actions={[
          { title: "All" },
          { title: "Ongoing" },
          { title: "Planned" },
          { title: "Finished" },
        ]}
      >
        <Button
          variant={filter == "" ? "tonal" : "accent"}
          iconRight="ChevronDown"
          className="mx-2 mb-4 self-start"
        >
          {filter == "" ? "All" : capitalize(filter)}
        </Button>
      </ContextMenu>
      <Comp />
    </Animated.View>
  )
}
