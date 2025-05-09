import { useWindowDimensions, View } from "react-native"
import { FlashList } from "@shopify/flash-list"

import { useProperties } from "@/store/use-properties"

import { PulseView } from "@/components/ui/pulse-view"

import { TitleCardPlaceholder } from "@/features/home/components/title-card-placeholder"
import { getItemStyle } from "@/features/catalog/lib/item-position-align"

export const FetchingNextPageCards = ({
  isFetching,
}: {
  isFetching: boolean
}) => {
  const { width, height } = useWindowDimensions()
  const { catalogColumns } = useProperties()

  if (!isFetching) return null

  return (
    <PulseView className="flex-1 mt-0 mx-2">
      <FlashList
        removeClippedSubviews
        data={Array.from({ length: 60 })}
        onEndReachedThreshold={0.8}
        estimatedListSize={{
          width,
          height,
        }}
        drawDistance={height * 2}
        numColumns={catalogColumns}
        estimatedItemSize={190}
        renderItem={({ index }: { index: number }) => (
          <View
            className="mb-2"
            style={{
              ...getItemStyle(index, catalogColumns),
            }}
          >
            <TitleCardPlaceholder />
          </View>
        )}
      />
    </PulseView>
  )
}
