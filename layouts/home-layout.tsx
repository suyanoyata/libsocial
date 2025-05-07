import { Icon } from "@/components/icon"
import { useHomeTitles } from "@/features/home/api/use-home-titles"
import { withImpact } from "@/lib/utils"
import { router } from "expo-router"
import {
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  useColorScheme,
  View,
} from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

export const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  const { top } = useSafeAreaInsets()
  const { isRefetching, refetch } = useHomeTitles()

  const isDark = useColorScheme() == "dark"

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
            placeholderTextColor="#a1a1aa"
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
          <RefreshControl
            tintColor={isDark ? "white" : "black"}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
        className="flex-1 pt-2"
      >
        {children}
      </ScrollView>
    </View>
  )
}
