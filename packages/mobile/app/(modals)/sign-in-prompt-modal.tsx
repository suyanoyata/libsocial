import { Text } from "@/components/ui/text"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { cn } from "@/lib/utils"
import { router } from "expo-router"
import { SignInDiscord } from "@/features/auth/components/sign-in-discord"
import { SignInAnonymous } from "@/features/auth/components/sign-in-anonymous"
import { Icon } from "@/components/icon"

const Benefit = ({
  data,
  icon,
  fill,
}: {
  data: { heading: string; text: string }
  icon: string
  fill?: boolean
}) => {
  return (
    <View className="flex-row items-center gap-5">
      <Icon
        name={icon}
        size={32}
        filled={fill}
        variant="tonal"
        className={cn(
          fill ? "text-transparent" : "dark:text-violet-300 text-violet-700"
        )}
      />
      <View className="gap-0.5 flex-1">
        <Text className="text-violet-700 dark:text-violet-300 text-lg font-semibold">
          {data.heading}
        </Text>
        <Text className="text-muted font-medium text-sm">{data.text}</Text>
      </View>
    </View>
  )
}

export default function SignInPromptModal() {
  const { bottom } = useSafeAreaInsets()

  return (
    <View className="m-3 gap-2 flex-1">
      <Text className="text-primary text-3xl font-extrabold text-center">
        You need to Sign In
      </Text>
      <Text className="text-muted text-center font-medium">
        This feature is available only for signed in users
      </Text>
      <Text className="text-muted text-xl font-bold my-2">
        When creating account you'll have
      </Text>
      <Benefit
        fill
        data={{
          heading: "Bookmarks across devices",
          text: "Sign in to save your bookmarks across all your devices. After creating an account, your bookmarks are always synced and accessible.",
        }}
        icon="Bookmark"
      />
      <Text className="text-muted text-xl font-bold my-2">
        If you choose to sign in anonymously, you'll miss out on
      </Text>
      <Benefit
        data={{
          heading: "Adding related titles",
          text: "Sign in to help community adding related titles.",
        }}
        icon="HandHelping"
      />
      <View
        className="mt-auto flex-row gap-2"
        style={{ paddingBottom: bottom }}
      >
        <SignInDiscord fun={() => router.back()} />
        <SignInAnonymous className="flex-1" fun={() => router.back()} />
      </View>
    </View>
  )
}
