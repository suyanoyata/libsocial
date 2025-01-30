import { Text } from "@/components/ui/text";
import { PulseView } from "@/components/ui/pulse-view";

import { TitleRelationsCard } from "@/features/title/components/title-relations-card";
import { TitleRelationsPlaceholder } from "@/features/title/components/title-relations-placeholder";

import {
  RelationsData,
  RelationsResponse,
  TitleRelationsProps,
} from "@/features/title/types/title-relations-type";

import { api } from "@/lib/axios";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { FlatList, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const TitleRelations = ({ label, slug_url, endpoint }: TitleRelationsProps) => {
  const { data, isPending } = useQuery<RelationsResponse>({
    queryKey: [`title-${endpoint}`, slug_url],
    queryFn: async () => (await api.get(`/manga/${slug_url}/${endpoint}`)).data.data,
  });

  const relationData = useMemo<RelationsData[]>(() => {
    if (!data) return [];
    return data.map((item) => ({
      cover: item.media.cover.md,
      reason: endpoint == "relations" ? item.related_type.label : item.similar,
      title: item.media.eng_name != "" ? item.media.eng_name : item.media.name,
      slug_url: item.media.slug_url,
      type: item.media.type.label,
      status: item.media.status.label,
      site: item.media.site.toString(),
    }));
  }, [data]);

  if ((!isPending && !data) || (data && data.length == 0)) return null;

  return (
    <Animated.View className="my-2 relative h-[185px]">
      <Text className="text-zinc-300 text-2xl font-bold mb-2">{label}</Text>
      <View>
        {relationData.length == 0 ? (
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
              data={relationData}
              renderItem={({ item }) => <TitleRelationsCard item={item} />}
            />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};
