import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    >
      <Stack.Screen name="genres-picker-modal" />
      <Stack.Screen name="quick-search" />
      <Stack.Screen name="pick-bookmark-option" />
    </Stack>
  );
}
