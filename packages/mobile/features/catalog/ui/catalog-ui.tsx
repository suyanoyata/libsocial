import { FlashList } from "@shopify/flash-list"

import { useEffect, useRef, useState } from "react"
import { RefreshControl, useWindowDimensions, View } from "react-native"
import { useFilterStore } from "@/features/catalog/store/use-filter-store"
import useDebounce from "@/hooks/use-debounce"

import { useProperties } from "@/store/use-properties"

import { BaseTitle } from "@/features/shared/types/title"

import { useCatalogAPI } from "@/features/catalog/api/use-catalog-api"

import { getItemStyle } from "@/features/catalog/lib/item-position-align"

import { FetchingNextPageCards } from "@/features/catalog/components/catalog-fetching-cards"
import { CatalogHeader } from "@/features/catalog/components/catalog-header"
import { CatalogTitleCard } from "@/features/catalog/components/catalog-title-card"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { Text } from "@/components/ui/text"
import withBubble from "@/components/ui/withBubble"
import { Icon } from "@/components/icon"

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
  } = useCatalogAPI(query)

  const { width, height } = useWindowDimensions()
  const { catalogColumns, setCatalogImageWidth } = useProperties()

  const ref = useRef<View>(null)

  const data =
    _data?.pages.reduce<BaseTitle[]>(
      (acc, curr) => acc.concat(curr.data),
      []
    ) ?? []

  useEffect(() => {
    ref.current?.measure((x, y, width) => {
      setCatalogImageWidth(width)
    })
  }, [ref.current])

  const renderItem = ({ item, index }: { item: BaseTitle; index: number }) => (
    <View
      ref={ref}
      style={{
        ...getItemStyle(index, catalogColumns),
      }}
    >
      <CatalogTitleCard title={item} />
    </View>
  )

  const keyExtractor = (item: BaseTitle) => item.slug_url

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
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
    <FlashList
      className="pb-safe"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      removeClippedSubviews
      data={data}
      onEndReachedThreshold={0.8}
      onEndReached={() => fetchNextPage()}
      estimatedListSize={{
        width,
        height,
      }}
      keyExtractor={keyExtractor}
      drawDistance={height * 6}
      numColumns={catalogColumns}
      estimatedItemSize={190}
      renderItem={renderItem}
      ListFooterComponent={
        <FetchingNextPageCards
          isFetching={isFetchingNextPage && !!_data && _data.pages.length >= 10}
        />
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
