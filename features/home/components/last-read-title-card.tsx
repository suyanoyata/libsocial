import { Image } from "expo-image";
import { View, Text, Pressable, Alert } from "react-native";

import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker";
import { X } from "@/lib/icon-fix";
import { router } from "expo-router";

export const LastReadTitleCard = ({ item }: { item: LastReadItem }) => {
  const { removeItem } = useReadingTracker();

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/title-info",
          params: {
            slug_url: item.slug_url,
            site: item.site,
            withDelay: "1",
          },
        });
        router.push({
          pathname: "/manga-reader",
          params: {
            slug_url: item.slug_url,
            index: String(item.lastReadChapter - 1),
          },
        });
      }}
      className="bg-zinc-900 rounded-lg overflow-hidden flex-row w-[300px] active:bg-zinc-800/70"
    >
      <Pressable
        onPress={() => {
          removeItem(item.slug_url);
        }}
        className="absolute top-2 right-2 text-zinc-500 z-10"
      >
        <X className="text-zinc-400" strokeWidth={2.2} size={20} />
      </Pressable>
      <Image source={{ uri: item.cover.default }} style={{ width: 100, height: 140 }} />
      <View className="p-2 flex-1">
        <Text className="text-zinc-200 text-base font-semibold" numberOfLines={2}>
          {item.title}
        </Text>
        <View className="h-1.5 rounded-full bg-zinc-700 mt-auto overflow-hidden">
          <View
            className="bg-white h-1.5"
            style={{
              width: `${(item.lastReadChapter / item.overallChapters) * 100}%`,
            }}
          ></View>
        </View>
      </View>
    </Pressable>
  );
};
