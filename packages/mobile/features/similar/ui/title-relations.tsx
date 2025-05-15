import { Text } from "@/components/ui/text"
import { PulseView } from "@/components/ui/pulse-view"

import { TitleRelationsCard } from "@/features/similar/components/title-relations-card"
import { TitleRelationsPlaceholder } from "@/features/similar/components/title-relations-placeholder"

import { AddRelationsButton } from "@/features/similar/components/title-add-relations"

import { TitleRelationsProps } from "@/features/title/types/title-relations-type"

import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { FlatList, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

export const TitleRelations = ({
  label,
  slug_url,
  site,
}: TitleRelationsProps) => {
  const { data } = useQuery(
    trpc.titles.relations.list.queryOptions({ slug_url })
  )

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="my-2 relative h-[185px]"
    >
      <View className="flex items-center justify-between flex-row mb-2">
        <Text className="text-secondary text-2xl font-bold">{label}</Text>
        <AddRelationsButton slug_url={slug_url} site={site} />
      </View>
      <View>
        {data?.length == 0 ? (
          <PulseView className="absolute left-0 top-0 z-30" exiting={FadeOut}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 overflow-hidden rounded-lg"
              data={Array.from({ length: 10 })}
              renderItem={() => <TitleRelationsPlaceholder />}
            />
          </PulseView>
        ) : (
          <Animated.View entering={FadeIn}>
            <FlatList
              className="z-10"
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 overflow-hidden rounded-lg"
              data={data}
              renderItem={({ item }) => <TitleRelationsCard item={item} />}
            />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  )
}
