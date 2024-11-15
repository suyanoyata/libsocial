import { Tabs } from "expo-router";
import React from "react";

import { Bell, Bookmark, Home, LayoutGrid, Menu } from "lucide-react-native";
import ErrorBoundary from "react-native-error-boundary";
import { ErrorBoundaryComponent } from "@/components/error-boundary-component";

export default function TabLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: "white",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: "Закладки",
            tabBarIcon: ({ color }) => <Bookmark color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Каталог",
            tabBarIcon: ({ color }) => <LayoutGrid color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Главная",
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarBadge: 31,
            title: "Уведомления",
            tabBarIcon: ({ color }) => <Bell color={color} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Меню",
            tabBarIcon: ({ color }) => <Menu color={color} />,
          }}
        />
        {/* <Tabs.Screen
        name="demohtml"
        options={{
          title: "demo html",
          tabBarIcon: ({ color }) => <LucidePaperclip color={color} />,
        }}
      /> */}
      </Tabs>
    </ErrorBoundary>
  );
}
