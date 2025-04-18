import { Download, Home, LayoutGrid, MenuIcon, Trash2 } from "lucide-react-native";
import { Pressable, useColorScheme, View } from "react-native";
import { Tabs } from "expo-router";

import { Header } from "@/components/ui/header";

import { useCallback } from "react";
import { useProperties } from "@/store/use-properties";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGenresConstants } from "@/features/shared/api/use-filter-constants";

import MenuView from "react-native-context-menu-view";

import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";

import { ClearDownloadedChapters } from "@/features/downloads/components/clear-downloaded-chapters";

export default function TabsLayout() {
  useGenresConstants();

  const { siteId, setSiteId } = useProperties();
  const queryClient = useQueryClient();
  const { top } = useSafeAreaInsets();

  const isDark = useColorScheme() === "dark";

  const handleAction = useCallback(
    (event: string) => {
      if (event === siteId) return;

      api.defaults.headers["Site-Id"] = event;
      setSiteId(event);
      queryClient.clear();
      queryClient.refetchQueries({
        queryKey: ["home-titles"],
      });
    },
    [siteId]
  );

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
        tabBarButton: (props) => <Pressable {...props} />,
        tabBarLabelPosition: "beside-icon",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "rgb(100,100,100)",
        tabBarActiveTintColor: isDark ? "white" : "black",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {},
          tabBarIcon: ({ color }) => (
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
                  handleAction("5");
                } else {
                  handleAction("1");
                }
              }}
            >
              <View className="pointer-events-none">
                <Home color={color} />
              </View>
            </MenuView>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          sceneStyle: {},
          tabBarIcon: ({ color }) => <LayoutGrid color={color} />,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: "Downloads",
          headerTitle: "Downloads",
          header: (props) => <Header {...props} headerRight={<ClearDownloadedChapters />} />,
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Download
              color={color}
              className={cn(siteId == "5" && "dark:text-zinc-800 text-zinc-300")}
            />
          ),
          tabBarButton: (props) => (siteId == "5" ? <View {...props} /> : <Pressable {...props} />),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ color }) => <MenuIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
