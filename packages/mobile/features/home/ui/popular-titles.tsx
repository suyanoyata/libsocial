import { ScrollView } from "react-native"

import { FadeView } from "@/components/ui/fade-view"
import { PulseView } from "@/components/ui/pulse-view"

import { TitleCard } from "@/features/home/components/title-card"
import { TitleCardPlaceholder } from "@/features/home/components/title-card-placeholder"

import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"

export const PopularTitles = () => {
  const { data } = useQuery(trpc.titles.popular.queryOptions())

  const shouldRenderItems = !!data

  return (
    <ScrollView
      className="h-[240px] mt-1"
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
        gap: 8,
      }}
    >
      {shouldRenderItems && (
        <FadeView withEnter className="flex-row gap-2">
          {data &&
            data.data.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
        </FadeView>
      )}
      {!shouldRenderItems && (
        <PulseView className="flex-row gap-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <TitleCardPlaceholder key={index} />
          ))}
        </PulseView>
      )}
    </ScrollView>
  )
}
