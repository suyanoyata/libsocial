import { PulseView } from "@/components/ui/pulse-view"

import { TitleCard } from "@/features/home/components/title-card"
import { TitleCardPlaceholder } from "@/features/home/components/title-card-placeholder"

import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"

import type { PopularTitle } from "api/router/titleRouter"
import { FlashList } from "@shopify/flash-list"

export const PopularTitles = () => {
  const { data } = useQuery(trpc.titles.popular.queryOptions())

  return (
    <FlashList
      estimatedItemSize={120}
      data={data?.data as PopularTitle[]}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <TitleCard title={item} />}
      className="h-[240px] mt-1"
      horizontal
      ListEmptyComponent={
        <PulseView className="flex-row gap-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <TitleCardPlaceholder key={index} />
          ))}
        </PulseView>
      }
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
      }}
    />
  )
}
