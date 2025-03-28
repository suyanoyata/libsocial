import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

import { BaseTitle } from "@/features/shared/types/title";
import FastImage from "@d11/react-native-fast-image";
import { router } from "expo-router";

export const QuickSearchCard = ({ item }: { item: BaseTitle }) => {
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/quick-search-title-preview",
          params: { slug_url: item.slug_url, site: item.site },
        });
      }}
      className="mb-2 mx-2 bg-zinc-900 overflow-hidden rounded-lg flex-row active:bg-zinc-800/70"
    >
      <FastImage source={{ uri: item.cover.default }} style={{ width: 120, height: 160 }} />
      <View className="p-2 flex-1 relative">
        <Text className="text-zinc-300 font-medium text-base">{item.name}</Text>
      </View>
    </Pressable>
  );
};
