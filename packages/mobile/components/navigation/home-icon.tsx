import { useColorScheme, View } from "react-native"
import ContextMenu from "react-native-context-menu-view"

import { useCallback } from "react"
import { useProperties } from "@/store/use-properties"
import { useQueryClient } from "@tanstack/react-query"

import { TabIcon } from "@/components/navigation/tab-icon"

import { trpc } from "@/lib/trpc"

export const HomeTabIcon = ({ focused }: { focused: boolean }) => {
  const isDark = useColorScheme() === "dark"

  const { siteId, setSiteId } = useProperties()

  const queryClient = useQueryClient()

  const handleAction = useCallback(
    (event: string) => {
      if (event === siteId) return

      queryClient.invalidateQueries({
        queryKey: trpc.titles.popular.queryKey(),
      })

      queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.list.queryKey(),
      })

      setSiteId(event)
    },
    [siteId]
  )

  return (
    <ContextMenu
      dropdownMenuMode={false}
      disableShadow
      actions={[
        {
          title: "Manga",
          systemIcon: "bookmark.fill",
          iconColor: isDark ? "white" : "black",
        },
        {
          title: "Anime",
          systemIcon: "play.fill",
          iconColor: isDark ? "white" : "black",
        },
      ]}
      onPress={(value) => {
        if (value.nativeEvent.index == 1) {
          handleAction("5")
        } else {
          handleAction("1")
        }
      }}
    >
      <View className="pointer-events-none">
        <TabIcon icon="House" focused={focused} />
      </View>
    </ContextMenu>
  )
}
