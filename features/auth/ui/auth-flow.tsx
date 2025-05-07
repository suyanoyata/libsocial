import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import { useSession } from "@/features/auth/lib/auth"
import { SignInDiscord } from "@/features/auth/components/sign-in-discord"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SignInAnonymous } from "@/features/auth/components/sign-in-anonymous"
import { SignOutButton } from "@/features/auth/components/sign-out"

export const AuthFlow = () => {
  const { data } = useSession()

  if (!data) {
    return (
      <View>
        <Text className="text-3xl text-primary font-extrabold mb-2 mt-4">
          Sign In with
        </Text>
        <View className="items-center flex-row gap-2">
          <SignInDiscord />
          <SignInAnonymous className="flex-1" />
        </View>
      </View>
    )
  }

  if (data?.user.isAnonymous) {
    return (
      <View className="gap-2 mt-4">
        <Alert>
          <AlertTitle>Hey!</AlertTitle>
          <AlertDescription>
            You are signed in as anonymous. Once you sign out or delete
            application your data will be gone
          </AlertDescription>
        </Alert>
        <SignInDiscord />
        <SignOutButton />
      </View>
    )
  }

  return (
    <View className="mt-4 gap-2">
      <SignOutButton />
    </View>
  )
}
