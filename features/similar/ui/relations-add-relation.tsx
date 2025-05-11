import { FlatList, View } from "react-native"

import { TextInput } from "@/components/ui/text-input"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { memo, useEffect, useMemo, useState } from "react"
import { useNavigation } from "expo-router"
import useDebounce from "@/hooks/use-debounce"
import { useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTitleInfo } from "@/features/title/api/use-title-info"
import { useQuickSearch } from "@/features/quick-search/api/use-quick-search"

import { RelationAddTitle } from "@/features/similar/components/relations-relation-add-title"
import { BaseTitle } from "@/features/shared/types/title"
import Animated, { FadeIn } from "react-native-reanimated"
import { useQuery } from "@tanstack/react-query"
import { RelationsResponse } from "@/features/title/types/title-relations-type"
import { Text } from "@/components/ui/text"

export default function TitleRelationsAdd() {
  const route = useRoute()

  const { slug_url, site } = route.params as { slug_url: string; site: string }

  const { setOptions } = useNavigation()

  const { data } = useTitleInfo(slug_url, site)

  const { data: relations } = useQuery<RelationsResponse>({
    queryKey: ["title-relations", slug_url],
  })

  const { bottom } = useSafeAreaInsets()

  const controller = new AbortController()

  const [_search, setSearch] = useState("")
  const [search] = useDebounce(_search, 500)

  const { data: searchData, isPending } = useQuickSearch(
    search,
    controller.signal
  )

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

  const response = useMemo(() => {
    return searchData?.filter(
      (item) =>
        item.slug_url != data?.slug_url &&
        !relations?.some((relation) => relation.media.slug_url == item.slug_url)
    )
  }, [searchData])

  const Comp = memo(() => {
    if (search.length == 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Type something in search</Text>
        </View>
      )
    }

    if (_search != search || isPending) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      )
    }

    if (response && response.length != 0) {
      return (
        <Animated.View entering={FadeIn} className="flex-1">
          <FlatList data={response} renderItem={renderItem} />
        </Animated.View>
      )
    } else {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">
            Can't find anything for your search
          </Text>
        </View>
      )
    }
  })

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
        clearButtonMode="always"
        value={_search}
        onChangeText={setSearch}
        placeholder="Search for title"
        className="w-full mt-2"
      />
      <Comp />
    </View>
  )
}
