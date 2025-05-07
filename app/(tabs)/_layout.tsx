import { Pressable, useColorScheme, View } from "react-native"
import { Tabs } from "expo-router"

import { Header } from "@/components/ui/header"

import { useCallback } from "react"
import { useProperties } from "@/store/use-properties"
import { useQueryClient } from "@tanstack/react-query"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useGenresConstants } from "@/features/shared/api/use-filter-constants"

import MenuView from "react-native-context-menu-view"

import { api } from "@/lib/axios"
import { cn } from "@/lib/utils"

import { useSession } from "@/features/auth/lib/auth"
import FastImage from "@d11/react-native-fast-image"
import { TabIcon } from "@/components/navigation/tab-icon"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/icon"

export default function TabsLayout() {
  useGenresConstants()

  const { siteId, setSiteId } = useProperties()
  const queryClient = useQueryClient()
  const { top } = useSafeAreaInsets()

  const isDark = useColorScheme() === "dark"

  const handleAction = useCallback(
    (event: string) => {
      if (event === siteId) return

      api.defaults.headers["Site-Id"] = event
      setSiteId(event)
      queryClient.clear()
      queryClient.refetchQueries({
        queryKey: ["home-titles"],
      })
    },
    [siteId],
  )

  const { data } = useSession()

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        lazy: true,
        sceneStyle: {
          marginTop: top,
        },
        tabBarStyle: {
          backgroundColor: "#00000000",
          borderTopWidth: 0,
        },
        tabBarLabel: ({ focused, children }) => {
          return (
            <Text
              className={cn(
                "text-xs font-medium",
                focused ? "text-violet-700 dark:text-violet-200" : "text-muted",
              )}
            >
              {children}
            </Text>
          )
        },
        tabBarButton: (props) => <Pressable className="gap-2" {...props} />,
        headerShown: false,
        tabBarActiveTintColor: isDark ? "white" : "black",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {},
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <MenuView
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
            </MenuView>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          sceneStyle: {},
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="LayoutGrid" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          headerTitle: "Bookmarks",
          header: (props) => (
            <Header
              headerRight={<Icon name="Download" className="text-muted" />}
              {...props}
            />
          ),
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="Bookmark" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            data?.user.image ? (
              <View className={cn("size-8 rounded-full overflow-hidden")}>
                <FastImage
                  source={{ uri: data.user.image }}
                  style={{
                    height: 32,
                    width: 32,
                  }}
                />
              </View>
            ) : (
              <TabIcon icon="User" focused={focused} />
            ),
        }}
      />
    </Tabs>
  )
}
