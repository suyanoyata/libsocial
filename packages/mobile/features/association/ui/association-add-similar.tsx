import { useRoute } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import type { QuickSearchItem } from "api/router/searchRouter"
import type { Title } from "api/router/titleRouter"
import { useNavigation } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { View } from "react-native"
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedKeyboard,
  useAnimatedStyle
} from "react-native-reanimated"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AssociationCard } from "@/features/association/components/title-add-similar-card"
import { useQuickSearch } from "@/features/quick-search/api/use-quick-search"
import { useTitleInfo } from "@/features/title/api/use-title-info"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { DismissKeyboardView } from "@/components/ui/dismiss-keyboard-view"
import { Text } from "@/components/ui/text"
import { TextInput } from "@/components/ui/text-input"

import useDebounce from "@/hooks/use-debounce"

import { trpc } from "@/lib/trpc"

const Comp = ({
  title,
  _search,
  search,
  response,
  isPending
}: {
  title: Title
  _search: string
  search: string
  response?: QuickSearchItem[]
  isPending: boolean
}) => {
  const keyboard = useAnimatedKeyboard()

  const kbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 2.5 }]
  }))

  const renderItem = ({ item }: { item: QuickSearchItem }) => (
    <AssociationCard
      title={title}
      disabled={item.slug_url == title.slug_url}
      data={item}
    />
  )

  if (_search != search || isPending) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        className="flex-1 items-center justify-center"
        style={[kbStyle]}
      >
        <ActivityIndicator lottie />
      </Animated.View>
    )
  }

  if (search.length == 0) {
    return (
      <Animated.View style={[kbStyle]} className="flex-1 items-center justify-center">
        <Text className="text-muted">Type something in search</Text>
      </Animated.View>
    )
  }

  if (response && response.length != 0) {
    return <Animated.FlatList entering={FadeIn} data={response} renderItem={renderItem} />
  }

  return (
    <Animated.View
      style={[kbStyle]}
      entering={FadeIn}
      className="flex-1 items-center justify-center"
    >
      <Text className="text-muted">Can't find anything for your search</Text>
    </Animated.View>
  )
}

export default function AssociationAddSimilar() {
  const route = useRoute()

  const { slug_url, site } = route.params as {
    slug_url: string
    site: string
  }

  const { setOptions } = useNavigation()

  const { data } = useTitleInfo(slug_url, site)

  const { data: similars } = useQuery(trpc.titles.similar.list.queryOptions({ slug_url }))

  const { bottom } = useSafeAreaInsets()

  const [_search, setSearch] = useState("")
  const [search] = useDebounce(_search, 500)

  const { data: searchData, isFetching } = useQuickSearch(search)

  useEffect(() => {
    setOptions({
      title: data?.eng_name ?? data?.name
    })
  }, [data])

  const response = useMemo(() => {
    return searchData?.data.filter(
      (item) =>
        item.slug_url != data?.slug_url &&
        !similars?.some((similar) => similar.media!.slug_url == item.slug_url)
    )
  }, [searchData])

  if (!data) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <DismissKeyboardView
      className="mx-2 mt-2 flex-1 gap-3"
      style={{ paddingBottom: bottom }}
    >
      <TextInput
        clearButtonMode="always"
        value={_search}
        onChangeText={setSearch}
        placeholder="Search for title"
        className="w-full mt-2"
      />
      <Comp
        _search={_search}
        search={search}
        title={data}
        response={response}
        isPending={isFetching}
      />
    </DismissKeyboardView>
  )
}
