import { Text } from "@/components/ui/text"

import { TitleAssociationCard } from "@/features/association/components/title-association-card"

import { AddAssociationButton } from "@/features/association/components/title-add-association"

import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { TitleAssociationsList } from "@/features/association/ui/title-associations-list"

import type { TitleSimilarItem } from "api/router/titleRouter"

type TitleAssociationProps = {
  slug_url: string
  site: number
}

export const TitleSimilar = ({ slug_url, site }: TitleAssociationProps) => {
  const { data } = useQuery(trpc.titles.similar.list.queryOptions({ slug_url }))

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="my-2 relative h-[185px]"
    >
      <View className="flex items-center justify-between flex-row mb-2">
        <Text className="text-secondary text-2xl font-bold">Similar</Text>
        <AddAssociationButton type="similar" slug_url={slug_url} site={site} />
      </View>
      <TitleAssociationsList<TitleSimilarItem>
        data={data}
        slug_url={slug_url}
        renderItem={({ item }) => (
          <TitleAssociationCard type="similar" item={item} />
        )}
      />
    </Animated.View>
  )
}
