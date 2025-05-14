import { FlashList } from "@shopify/flash-list"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  RefreshControl,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native"
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

export const Catalog = () => {
  const [initialRender, setInitialRender] = useState(true)

  const { search } = useFilterStore()
  const [query] = useDebounce(search, 500)

  const {
    data: _data,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
  } = useCatalogAPI(query)

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

  const isDark = useColorScheme() === "dark"

  const keyExtractor = (item: BaseTitle) => item.slug_url

  if (Math.floor(width / containerWidth) != catalogColumns || initialRender)
    return null

  return (
    <>
      <CatalogHeader />
      <View
        style={{
          height,
        }}
        className="flex-1 overflow-hidden rounded-sm"
      >
        {data ? (
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
            style={{
              height,
            }}
            keyExtractor={keyExtractor}
            drawDistance={height * 6}
            numColumns={catalogColumns}
            estimatedItemSize={190}
            renderItem={renderItem}
            ListFooterComponent={
              <FetchingNextPageCards
                isFetching={
                  isFetchingNextPage && !!_data && _data.pages.length >= 10
                }
              />
            }
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}
      </View>
    </>
  )
}
