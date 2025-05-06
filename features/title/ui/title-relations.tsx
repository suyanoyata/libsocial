import { Text } from "@/components/ui/text";
import { PulseView } from "@/components/ui/pulse-view";

import { TitleRelationsCard } from "@/features/title/components/title-relations-card";
import { TitleRelationsPlaceholder } from "@/features/title/components/title-relations-placeholder";

import {
  RelationsResponse,
  TitleRelationsProps,
} from "@/features/title/types/title-relations-type";

import { api } from "@/lib/axios";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { FlatList, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AddRelationsButton } from "@/features/title/components/title-add-relations";

export const TitleRelations = ({ label, slug_url, endpoint, site }: TitleRelationsProps) => {
  const { data, isPending } = useQuery<RelationsResponse>({
    queryKey: [`title-${endpoint}`, slug_url],
    queryFn: async () => (await api.get(`/manga/${slug_url}/${endpoint}`)).data.data,
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="my-2 relative h-[185px]">
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
  );
};
