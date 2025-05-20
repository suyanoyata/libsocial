import { Pressable, View } from "react-native"
import { router, Tabs } from "expo-router"

import { Header } from "@/components/ui/header"

import { useSession } from "@/lib/auth"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useGenresConstants } from "@/features/shared/api/use-filter-constants"

import { cn } from "@/lib/utils"

import FastImage from "@d11/react-native-fast-image"

import { Icon } from "@/components/icon"
import { Text } from "@/components/ui/text"

import { TabIcon } from "@/components/navigation/tab-icon"
import { HomeTabIcon } from "@/components/navigation/home-icon"
import { useProperties } from "@/store/use-properties"
import { TabBar } from "@/components/navigation/tab-bar"

export default function TabsLayout() {
  useGenresConstants()
  const { top } = useSafeAreaInsets()

  const { data } = useSession()

  const { siteId } = useProperties()

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        header: (props) => <Header {...props} />,
        lazy: false,
        sceneStyle: {
          marginTop: top,
        },
        tabBarStyle: {
          paddingTop: 2,
          backgroundColor: "#00000000",
          borderTopWidth: 0,
        },
        tabBarLabel: ({ focused, children }) => {
          return (
            <Text
              className={cn(
                "text-xs font-medium",
                focused ? "text-violet-700 dark:text-violet-200" : "text-muted"
              )}
            >
              {children}
            </Text>
          )
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {},
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
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
              headerRight={
                <Icon
                  disabled={siteId == "5"}
                  size={20}
                  hitSlop={10}
                  onPress={() => router.push("/downloads")}
                  name="Download"
                  className="text-muted disabled:opacity-0"
                />
              }
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
              <View
                className={cn(
                  "size-10 rounded-full overflow-hidden items-center justify-center",
                  focused && "bg-violet-600 dark:bg-violet-300"
                )}
              >
                <FastImage
                  source={{ uri: data.user.image }}
                  style={{
                    borderRadius: 999,
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
