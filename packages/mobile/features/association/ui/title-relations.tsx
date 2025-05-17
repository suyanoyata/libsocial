import { Text } from "@/components/ui/text"

import { AddAssociationButton } from "@/features/association/components/title-add-association"

import { TitleAssociationCard } from "@/features/association/components/title-association-card"

import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { TitleAssociationsList } from "@/features/association/ui/title-associations-list"

import type { TitleRelatedItem } from "api/router/titleRouter"

type TitleAssociationProps = {
  slug_url: string
  site: number
}

export const TitleRelations = ({ slug_url, site }: TitleAssociationProps) => {
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
        <Text className="text-secondary text-2xl font-bold">Related</Text>
        <AddAssociationButton slug_url={slug_url} site={site} />
      </View>
      <TitleAssociationsList<TitleRelatedItem>
        data={data}
        slug_url={slug_url}
        renderItem={({ item }) => <TitleAssociationCard item={item} />}
      />
    </Animated.View>
  )
}
