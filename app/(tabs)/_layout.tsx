import { Home, LayoutGrid, MenuIcon } from "lucide-react-native";
import { Tabs } from "expo-router";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGenresConstants } from "@/features/shared/api/use-filter-constants";

import { MenuView } from "@react-native-menu/menu";

import { useProperties } from "@/store/use-properties";
import { api } from "@/lib/axios";

export default function TabsLayout() {
  useGenresConstants();

  const { siteId, setSiteId } = useProperties();
  const queryClient = useQueryClient();
  const { top } = useSafeAreaInsets();

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
        lazy: true,
        sceneStyle: {
          marginTop: top,
        },
        tabBarStyle: {
          backgroundColor: "#09090b",
          borderTopWidth: 0,
        },
        tabBarLabelPosition: "beside-icon",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "rgb(100,100,100)",
        tabBarActiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {},
          tabBarIcon: ({ color }) => (
            <MenuView
              themeVariant="dark"
              shouldOpenOnLongPress
              actions={[
                { id: "1", title: "Manga", image: "bookmark.fill", imageColor: "white" },
                { id: "5", title: "Anime", image: "play.fill", imageColor: "white" },
              ]}
              onPressAction={(value) => handleAction(value.nativeEvent.event)}
            >
              <Home color={color} />
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
        name="menu"
        options={{
          tabBarIcon: ({ color }) => <MenuIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
