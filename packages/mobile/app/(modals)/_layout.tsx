import { Stack } from "expo-router"

import { View } from "react-native"

import { BackButton } from "@/components/ui/back-button"
import { QuickSearchHeader } from "@/components/ui/quick-search-header"
import { Header } from "@/components/ui/header"

// Provided here screens will be non-modal unless it's first in stack
export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: "minimal",
        header: () => (
          <View className="mt-4 mx-2 android:mt-safe">
            <BackButton position="static" />
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="association-add-relation"
        options={{
          headerShown: true,
          title: "Add relation",
          header: (props) => (
            <Header showBackButton className="my-1" {...props} />
          ),
        }}
      />
      <Stack.Screen
        name="association-add-similar"
        options={{
          headerShown: true,
          title: "Add similar",
          header: (props) => (
            <Header showBackButton className="my-1" {...props} />
          ),
        }}
      />
      <Stack.Screen
        name="quick-search-title-preview"
        options={{
          headerShown: true,
          header: () => <QuickSearchHeader />,
        }}
      />
    </Stack>
  )
}
