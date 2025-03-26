import { Stack } from "expo-router";

// Provide here screens that should be in modal, but not look like modal
export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="quick-search-title-preview" />
    </Stack>
  );
}
