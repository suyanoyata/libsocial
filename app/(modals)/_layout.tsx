import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }}>
      <Stack.Screen
        name="quick-search-title-preview"
        options={{ presentation: "containedTransparentModal" }}
      />
    </Stack>
  );
}
