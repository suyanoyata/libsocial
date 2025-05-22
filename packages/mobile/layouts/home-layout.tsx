import { router } from "expo-router"

import { Pressable, ScrollView as _ScrollView, View } from "react-native"

import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { withImpact } from "@/lib/utils"
import { TextInput } from "@/components/ui/text-input"
import { withRefreshable } from "@/components/ui/with-refreshable"

const ScrollView = withRefreshable(_ScrollView)

export const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  const { top } = useSafeAreaInsets()
  const { isRefetching, refetch } = useQuery(trpc.titles.popular.queryOptions())

  return (
    <View className="flex-1 mt-safe-offset-2">
      <TextInput
        className="mx-2 mb-2"
        placeholder="Search..."
        editable={false}
      />
      <Pressable
        className="flex-1 absolute top-0 left-0 h-14 w-full z-30"
        style={{ height: 64 + top }}
        onPress={() => withImpact(() => router.push("/quick-search"))}
      />
      <ScrollView onRefresh={refetch} className="flex-1 pt-2">
        {children}
      </ScrollView>
    </View>
  )
}
