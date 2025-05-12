import { View } from "react-native"

import { Text } from "@/components/ui/text"

import { useSession } from "@/features/auth/lib/auth"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { LinkAccountWithDiscord } from "@/features/auth/components/profile-link-account"
import { SignInAnonymous } from "@/features/auth/components/sign-in-anonymous"
import { SignInDiscord } from "@/features/auth/components/sign-in-discord"
import { SignOutButton } from "@/features/auth/components/sign-out"

import FastImage from "@d11/react-native-fast-image"

export const Profile = () => {
  const { data } = useSession()

  if (!data) {
    return (
      <View className="bg-muted-darken rounded-2xl p-2 py-3 mt-3">
        <Text className="text-3xl text-secondary font-extrabold mb-2">
          Sign In with
        </Text>
        <View className="items-center flex-row gap-2">
          <SignInDiscord />
          <SignInAnonymous className="flex-1" />
        </View>
      </View>
    )
  }

  return (
    <View>
      {data.user.isAnonymous && (
        <View className="gap-2 mt-4">
          <Alert>
            <AlertTitle>Hey!</AlertTitle>
            <AlertDescription>
              You are signed in as anonymous. Once you sign out or delete
              application your data will be gone
            </AlertDescription>
          </Alert>
        </View>
      )}
      <View className="bg-muted-darken rounded-2xl px-4 py-3 mt-3 active:bg-muted flex-row items-center gap-2">
        {data.user.image && (
          <FastImage
            style={{ width: 36, height: 36, borderRadius: 999 }}
            source={{ uri: data.user.image }}
          />
        )}
        <View className="mr-auto flex-1">
          <Text
            className="text-3xl text-secondary font-extrabold mr-2"
            numberOfLines={1}
          >
            {data.user.name}
          </Text>
        </View>
        {data.user.isAnonymous && <LinkAccountWithDiscord />}
        <SignOutButton />
      </View>
    </View>
  )
}
