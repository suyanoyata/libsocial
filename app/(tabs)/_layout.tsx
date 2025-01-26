import { Bell, Home, LayoutGrid, MenuIcon } from "lucide-react-native";
import { View } from "react-native";
import { Tabs } from "expo-router";

import { useGenresConstants } from "@/features/shared/api/use-filter-constants";
import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  useImageServers();
  useGenresConstants();

  const { top } = useSafeAreaInsets();

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
          tabBarIcon: ({ color }) => <Home color={color} />,
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
