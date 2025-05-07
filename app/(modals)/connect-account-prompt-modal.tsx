import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/ui/text"

import { SignInDiscord } from "@/features/auth/components/sign-in-discord"

export default function ConnectAccountPrompt() {
  const { bottom } = useSafeAreaInsets()

  return (
    <View className="m-3 gap-2 flex-1" style={{ paddingBottom: bottom }}>
      <Text className="text-primary text-3xl font-extrabold text-center">
        You need to link account
      </Text>
      <Text className="text-muted text-center font-medium mb-auto">
        This feature is not available for anonymous users
      </Text>
      <SignInDiscord />
    </View>
  )
}
