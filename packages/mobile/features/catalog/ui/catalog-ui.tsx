import { useEffect, useRef, useState } from "react"
import { useWindowDimensions, View, FlatList as _FlatList } from "react-native"
import { useFilterStore } from "@/features/catalog/store/use-filter-store"
import useDebounce from "@/hooks/use-debounce"

import { useProperties } from "@/store/use-properties"

import { BaseTitle } from "@/features/shared/types/title"

import { useCatalogAPI } from "@/features/catalog/api/use-catalog-api"

import { FetchingNextPageCards } from "@/features/catalog/components/catalog-fetching-cards"
import { CatalogHeader } from "@/features/catalog/components/catalog-header"
import { CatalogTitleCard } from "@/features/catalog/components/catalog-title-card"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { Text } from "@/components/ui/text"
import { Icon } from "@/components/icon"
import { Lottie } from "@/components/ui/lottie"

import withBubble from "@/components/ui/withBubble"
import { withRefreshable } from "@/components/ui/with-refreshable"

const FlatList = withRefreshable(_FlatList<BaseTitle>)

const Comp = () => {
  const { search, genres } = useFilterStore()
  const [query] = useDebounce(search, 500)

  const {
    data: _data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
    error,
  } = useCatalogAPI(query)

  const data =
    _data?.pages.reduce<BaseTitle[]>(
      (acc, curr) => acc.concat(curr.data),
      []
    ) ?? []

  const renderItem = ({ item }: { item: BaseTitle }) => (
    <CatalogTitleCard title={item} />
  )

  const keyExtractor = (item: BaseTitle) => item.slug_url

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator lottie />
      </View>
    )
  }

  if (error?.message == "Network request failed") {
    return (
      <View className="flex-1 items-center justify-center gap-2">
        <Lottie source={require("@/assets/lottie/duck.json")} />
        <Text className="text-primary text-xl font-semibold">
          No connection with server
        </Text>
      </View>
    )
  }

  if (data.length == 0) {
    const BubbleIcon = withBubble(Icon)

    const message = () => {
      if (query.length > 0) {
        return `Can't find content for "${query}"`
      }
      if (genres.length > 0 && query.length > 0) {
        return "Try removing some genres or adjust your search."
      }
      if (genres.length > 0) {
        return "Adjust your genres and try again."
      }
      return "Unfortunately, we couldn't find any content."
    }

    return (
      <View className="flex-1 items-center justify-center gap-1.5">
        <BubbleIcon name="Unplug" />
        <Text className="text-primary text-xl font-bold">
          No results found.
        </Text>
        <Text className="text-muted text-center">{message()}</Text>
      </View>
    )
  }

  return (
    <FlatList
      onRefresh={refetch}
      className="pb-safe"
      contentContainerClassName="flex-row flex-wrap justify-start gap-2 mx-2"
      removeClippedSubviews
      data={data}
      onEndReachedThreshold={0.8}
      onEndReached={() => fetchNextPage()}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListFooterComponent={
        <FetchingNextPageCards isFetching={isFetchingNextPage} />
      }
    />
  )
}

export const Catalog = () => {
  const [initialRender, setInitialRender] = useState(true)

  const { width, height } = useWindowDimensions()
  const { catalogColumns, setCatalogColumns, setCatalogImageWidth } =
    useProperties()

  const containerWidth = 130

  const ref = useRef<View>(null)

  useEffect(() => {
    if (Math.floor(width / containerWidth) != catalogColumns) {
      setCatalogColumns(Math.floor(width / containerWidth))
    }
    setInitialRender(false)
  }, [width])

  useEffect(() => {
    ref.current?.measure((x, y, width) => {
      setCatalogImageWidth(width)
    })
  }, [ref.current])

  if (Math.floor(width / containerWidth) != catalogColumns || initialRender)
    return null

  return (
    <View style={{ flex: 1 }}>
      <CatalogHeader />
      <View
        style={{
          height,
        }}
        className="flex-1 overflow-hidden rounded-sm"
      >
        <Comp />
      </View>
    </View>
  )
}
