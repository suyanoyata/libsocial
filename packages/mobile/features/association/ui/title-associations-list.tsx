import { PulseView } from "@/components/ui/pulse-view"

import { TitleAssociationsPlaceholder } from "@/features/association/components/title-associations-placeholder"

import { FlatList, FlatListProps, ListRenderItem } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

type TitleAssociationsProps<T> = Omit<
  FlatListProps<T>,
  "data" | "renderItem"
> & {
  data?: T[]
  slug_url: string
  renderItem: ListRenderItem<T>
}

export const TitleAssociationsList = <T,>({
  data,
  renderItem,
  slug_url,
  ...props
}: TitleAssociationsProps<T>) => {
  if (!data || data.length === 0) {
    return (
      <PulseView className="absolute left-0 top-11 z-30" exiting={FadeOut}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 overflow-hidden rounded-lg"
          data={Array.from({ length: 10 })}
          renderItem={() => <TitleAssociationsPlaceholder />}
        />
      </PulseView>
    )
  }

  return (
    <Animated.View entering={FadeIn}>
      <FlatList<T>
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 overflow-hidden rounded-lg"
        renderItem={renderItem}
        data={data}
        {...props}
      />
    </Animated.View>
  )
}
