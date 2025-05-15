import { FlatList, RefreshControl, View } from "react-native"

import { useSession } from "@/lib/auth"

import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

import Animated, { FadeIn } from "react-native-reanimated"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import { Icon } from "@/components/icon"

import ContextMenu from "react-native-context-menu-view"

import withBubble from "@/components/ui/withBubble"
import { memo, useState } from "react"
import { capitalize } from "@/lib/utils"

import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"
import { BookmarkListItem } from "api/router/bookmarkRouter"

function Bookmarks() {
  const { isPending } = useSession()

  const [filter, setFilter] = useState("")

  const {
    data: bookmarks,
    isPending: isBookmarksPending,
    refetch,
  } = useQuery(trpc.bookmarks.list.queryOptions(filter))

  const Bookmark = withBubble(Icon)

  const renderItem = ({ item: bookmark }: { item: BookmarkListItem }) => (
    <BookmarkItem bookmark={bookmark} />
  )

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
      <FlatList
        data={bookmarks}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerClassName="gap-2 mx-2"
        className="flex-1"
      />
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
          { title: "Planned" },
          { title: "Ongoing" },
          { title: "Finished" },
          {
            title: "Dropped",
          },
          {
            title: "Favorite",
          },
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

export default memo(Bookmarks)
