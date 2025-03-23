import { Bell, Home, LayoutGrid, MenuIcon } from "lucide-react-native";
import { View } from "react-native";
import { Tabs } from "expo-router";

import { useGenresConstants } from "@/features/shared/api/use-filter-constants";
import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuView } from "@react-native-menu/menu";
import { AllowedSiteIds, useProperties } from "@/store/use-properties";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
// import { useVideoServers } from "@/features/shared/api/use-video-servers";

export default function TabsLayout() {
  useImageServers();
  // useVideoServers();
  useGenresConstants();

  const { setSiteId } = useProperties();
  const queryClient = useQueryClient();
  const { top } = useSafeAreaInsets();

  const handleAction = useCallback((event: AllowedSiteIds) => {
    setSiteId(event);
    queryClient.clear();
    queryClient.removeQueries({
      queryKey: ["home-titles"],
    });
    queryClient.refetchQueries({
      queryKey: ["home-titles"],
    });
  }, []);

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
              shouldOpenOnLongPress
              actions={[
                { id: "1", title: "Manga" },
                { id: "5", title: "Anime" },
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
        name="notifications"
        options={{
          tabBarButton: (props) => <View {...props} />,
          // tabBarBadge: 2,
          tabBarIcon: ({ color }) => <Bell color="#2a2a2a" />,
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
