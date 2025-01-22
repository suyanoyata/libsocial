import { Stack, Tabs } from "expo-router";
import { Home, LayoutGrid } from "lucide-react-native";
import { useImageServers } from "@/features/shared/api/use-image-servers";

export default function TabsLayout() {
  useImageServers();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#09090b",
          borderTopWidth: 0,
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "rgb(100,100,100)",
        tabBarActiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          tabBarIcon: ({ color }) => <LayoutGrid color={color} />,
        }}
      />
    </Tabs>
  );
}
