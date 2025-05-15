import { router } from "expo-router"

import { Icon } from "@/components/icon"
import {
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from "react-native"

import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { withImpact } from "@/lib/utils"

export const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  const { top } = useSafeAreaInsets()
  const { isRefetching, refetch } = useQuery(trpc.titles.popular.queryOptions())

  return (
    <View className="flex-1">
      <View
        style={{ paddingTop: top + 4, paddingBottom: 12 }}
        className="bg-accent-darken relative"
      >
        <View className="bg-accent px-4 py-2 h-10 items-center flex-row font-medium rounded-md mx-2 z-10">
          <TextInput
            editable={false}
            placeholder="Search..."
            className="placeholder:text-muted font-medium flex-1 pl-5"
          />
          <Icon
            name="Search"
            className="text-muted absolute left-1.5"
            size={20}
          />
        </View>
        <Pressable
          className="flex-1 absolute top-0 left-0 h-14 w-full z-30"
          style={{ height: 64 + top }}
          onPress={() => withImpact(() => router.push("/quick-search"))}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        className="flex-1 pt-2"
      >
        {children}
      </ScrollView>
    </View>
  )
}
