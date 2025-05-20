import { View } from "react-native"
import { Text } from "@/components/ui/text"
import Bookmarks from "@/features/bookmark/ui/bookmarks"

import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { SignInAnonymous } from "@/features/auth/components/sign-in-anonymous"
import { SignInDiscord } from "@/features/auth/components/sign-in-discord"

import { useSession } from "@/lib/auth"

export default function BookmarksView() {
  const { data, isPending } = useSession()

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (!data) {
    return (
      <View className="flex-1 gap-2 m-2">
        <Text className="text-primary text-3xl font-extrabold text-center">
          You need to Sign In
        </Text>
        <Text className="text-muted text-center font-medium">
          This feature is available only for signed in users
        </Text>
        <View className="flex-row gap-2 w-full mt-auto mb-4 px-2">
          <SignInDiscord className="flex-1" />
          <SignInAnonymous className="flex-1" />
        </View>
      </View>
    )
  }

  return <Bookmarks />
}
