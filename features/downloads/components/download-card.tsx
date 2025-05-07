import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

import { TransitionedImage } from "@/features/shared/components/transitioned-image";

import { router } from "expo-router";

import { DownloadedChapter, useDownloads } from "@/features/downloads/store/use-downloads";

export const DownloadCard = ({ item }: { item: DownloadedChapter }) => {
  const deleteChapter = useDownloads((state) => state.deleteChapter);

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/downloaded-reader",
          params: {
            slug_url: item.title.slug_url,
            volume: item.chapter.volume,
            chapter: item.chapter.number,
          },
        });
      }}
      className="bg-muted-darken active:opacity-90 overflow-hidden rounded-lg flex-row"
    >
      <TransitionedImage width={120} height={160} source={{ uri: item.title.cover.default }} />
      <View className="p-2 flex-1 relative">
        <Text className="text-primary font-medium text-base">
          {item.title.eng_name ?? item.title.name}
        </Text>
        <Text className="text-secondary font-medium text-sm" numberOfLines={4}>
          {item.title.summary}
        </Text>
        <View className="mt-auto">
          <Text className="text-muted text-sm font-medium">You have 3 chapters downloaded</Text>
        </View>
      </View>
    </Pressable>
  );
};
