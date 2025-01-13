import { Tabs } from "expo-router";
import React from "react";

import { Bell, Bookmark, Home, LayoutGrid, Menu } from "lucide-react-native";
import ErrorBoundary from "react-native-error-boundary";
import { ErrorBoundaryComponent } from "@/components/error-boundary-component";
import { useNotificationsCountStore } from "@/hooks/useNotificationsCountStore";
import i18n from "@/lib/intl";
import { useCurrentUser } from "@/features/users/api/useCurrentUser";

export default function TabLayout() {
  const { notificationsCount } = useNotificationsCountStore();
  useCurrentUser();

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "rgb(100,100,100)",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: i18n.t("tabs.bookmarks"),
            tabBarIcon: ({ color }) => <Bookmark color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: i18n.t("tabs.search"),
            tabBarIcon: ({ color }) => <LayoutGrid color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: i18n.t("tabs.index"),
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarBadge: notificationsCount,
            title: i18n.t("tabs.notifications"),
            tabBarIcon: ({ color }) => <Bell color={color} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: i18n.t("tabs.menu"),
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
