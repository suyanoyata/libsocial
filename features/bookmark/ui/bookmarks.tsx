import { RefreshControl, ScrollView, View } from "react-native"
import { Text } from "@/components/ui/text"

import { SignInAnonymous } from "@/features/auth/components/sign-in-anonymous"
import { SignInDiscord } from "@/features/auth/components/sign-in-discord"

import { useSession } from "@/features/auth/lib/auth"

import { useBookmarksAPI } from "@/features/bookmark/api/use-bookmarks-api"

import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"

export default function Bookmarks() {
  const { data } = useSession()

  const { data: bookmarks, refetch, isRefetching } = useBookmarksAPI()

  if (data)
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="white"
          />
        }
        contentContainerClassName="gap-2 m-2"
        className="flex-1"
      >
        {bookmarks?.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}
      </ScrollView>
    )

  return (
    <View className="flex-1 gap-2 m-2">
      <Text className="text-primary text-3xl font-extrabold text-center">
        You need to Sign In
      </Text>
      <Text className="text-muted text-center font-medium">
        This feature is available only for signed in users
      </Text>
      <View className="flex-row gap-2 mt-auto mb-4 mx-2">
        <SignInDiscord />
        <SignInAnonymous className="flex-1" />
      </View>
    </View>
  )
}
