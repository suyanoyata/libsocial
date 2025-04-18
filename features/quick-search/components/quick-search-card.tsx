import { useMemo } from "react";

import { Pressable, useWindowDimensions, View } from "react-native";
import FastImage from "@d11/react-native-fast-image";

import { Text } from "@/components/ui/text";
import { Genres } from "@/features/title/components/genres";

import { BaseTitle } from "@/features/shared/types/title";

import { router } from "expo-router";

export const QuickSearchCard = ({ item }: { item: BaseTitle }) => {
  const { width } = useWindowDimensions();

  const genres = useMemo(() => item.genres.slice(0, width / 140), [item.genres, width]);

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/quick-search-title-preview",
          params: { slug_url: item.slug_url, site: item.site },
        });
      }}
      className="mb-2 mx-2 bg-muted-darken active:opacity-90 overflow-hidden rounded-lg flex-row"
    >
      <FastImage source={{ uri: item.cover.default }} style={{ width: 120, height: 160 }} />
      <View className="p-2 flex-1 relative">
        <Text className="text-primary font-medium text-base">{item.eng_name ?? item.name}</Text>
        <Text className="text-muted font-medium text-sm" numberOfLines={4}>
          {item.summary}
        </Text>
        <View className="mt-auto pointer-events-none">
          <Genres genres={genres} />
        </View>
      </View>
    </Pressable>
  );
};
