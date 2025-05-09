import { FlatList, View } from "react-native"

import { TextInput } from "@/components/ui/text-input"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { useEffect, useState } from "react"
import { useNavigation } from "expo-router"
import useDebounce from "@/hooks/use-debounce"
import { useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTitleInfo } from "@/features/title/api/use-title-info"
import { useQuickSearch } from "@/features/quick-search/api/use-quick-search"

import { RelationAddTitle } from "@/features/similar/components/relations-relation-add-title"
import { BaseTitle } from "@/features/shared/types/title"
import Animated, { FadeIn } from "react-native-reanimated"

export default function TitleRelationsAdd() {
  const route = useRoute()

  const { slug_url, site } = route.params as { slug_url: string; site: string }

  const { setOptions } = useNavigation()

  const { data } = useTitleInfo(slug_url, site)

  const { bottom } = useSafeAreaInsets()

  const controller = new AbortController()

  const [_search, setSearch] = useState("Akame")
  const [search] = useDebounce(_search, 500)

  const { data: searchData } = useQuickSearch(search, controller.signal)

  useEffect(() => {
    setOptions({
      title: data?.eng_name ?? data?.name,
    })
  }, [data])

  const renderItem = ({ item }: { item: BaseTitle }) => (
    <RelationAddTitle
      slug_url={slug_url}
      disabled={item.slug_url == data?.slug_url}
      data={item}
    />
  )

  if (!data) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View className="mx-2 mt-2 flex-1 gap-3" style={{ paddingBottom: bottom }}>
      <TextInput
        value={_search}
        onChangeText={setSearch}
        placeholder="Search for title"
        className="w-full mt-2"
      />
      {searchData && (
        <Animated.View entering={FadeIn} className="flex-1">
          <FlatList data={searchData} renderItem={renderItem} />
        </Animated.View>
      )}
    </View>
  )
}
