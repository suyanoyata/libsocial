import { router, Tabs } from "expo-router"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useGenresConstants } from "@/features/shared/api/use-filter-constants"

import { Icon } from "@/components/icon"

import { HomeTabIcon } from "@/components/navigation/home-icon"
import { TabBar } from "@/components/navigation/tab-bar"
import { TabIcon } from "@/components/navigation/tab-icon"
import { Header } from "@/components/ui/header"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { useProperties } from "@/store/use-properties"

export default function TabsLayout() {
  useGenresConstants()
  const { top } = useSafeAreaInsets()

  const { siteId } = useProperties()

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        animation: "fade",
        header: (props) => <Header {...props} />,
        lazy: false,
        sceneStyle: {
          marginTop: top
        },
        tabBarStyle: {
          paddingTop: 2,
          backgroundColor: "#00000000",
          borderTopWidth: 0
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
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {},
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          sceneStyle: {},
          tabBarIcon: ({ focused }) => <TabIcon icon="LayoutGrid" focused={focused} />
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
          tabBarIcon: ({ focused }) => <TabIcon icon="Bookmark" focused={focused} />
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ focused }) => <TabIcon icon="User" focused={focused} />
        }}
      />
    </Tabs>
  )
}
