import { ActionMenuOption } from "@/components/ui/action-menu-option"

import { Text } from "@/components/ui/text"
import { Profile } from "@/features/auth/ui/profile"
import { mmkv } from "@/lib/storage"
import FastImage from "@d11/react-native-fast-image"

import { useQueryClient } from "@tanstack/react-query"

import { SafeAreaView } from "react-native"

export default function Menu() {
  const queryClient = useQueryClient()

  return (
    <SafeAreaView className="mx-4 gap-2">
      <Profile />
      <Text className="text-3xl text-primary font-extrabold -mb-2 mt-2">Settings</Text>
      <ActionMenuOption
        buttonVariant="destructive"
        note="This will clear all previous network requests, such as catalog, search results data and so on... Your downloaded chapters, search and reading history will remain."
        actionText="Clear"
        action={() => {
          mmkv.delete("libsocial.client.cache")
          FastImage.clearDiskCache()
          FastImage.clearMemoryCache()
          queryClient.clear()
        }}
      >
        Clear network caches
      </ActionMenuOption>
      <Text className="text-muted text-center mt-4">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  )
}
