import FastImage from "@d11/react-native-fast-image";
import { router } from "expo-router";

import { useMemo } from "react";
import { View, Pressable } from "react-native";

import { Text } from "@/components/ui/text";

import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker";

import { X } from "lucide-react-native";

export const LastReadTitleCard = ({ item }: { item: LastReadItem }) => {
  const { removeItem } = useReadingTracker();

  const allChaptersRead = useMemo(() => item.lastReadChapter === item.overallChapters, [item]);

  if (item.hide) return null;

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/title-info",
          params: {
            slug_url: item.slug_url,
            site: item.site,
            withDelay: allChaptersRead ? undefined : "1",
          },
        });
        if (!allChaptersRead) {
          router.push({
            pathname: "/manga-reader",
            params: {
              slug_url: item.slug_url,
              index: String(item.lastReadChapter - 1),
            },
          });
        }
      }}
      className="bg-zinc-900 rounded-lg overflow-hidden flex-row w-[300px] active:bg-zinc-800/70"
    >
      <Pressable
        onPress={() => {
          removeItem(item.slug_url);
        }}
        hitSlop={8}
        className="absolute top-2 right-2 text-zinc-500 z-10"
      >
        <X className="text-zinc-400" strokeWidth={2.2} size={20} />
      </Pressable>
      <FastImage source={{ uri: item.cover.default }} style={{ width: 100, height: 140 }} />
      <View className="p-2 flex-1">
        <Text className="text-zinc-200 text-base font-semibold w-[90%]" numberOfLines={2}>
          {item.title}
        </Text>
        {!allChaptersRead ? (
          <View className="h-1.5 rounded-full bg-zinc-700 mt-auto overflow-hidden">
            <View
              className="bg-white h-1.5"
              style={{
                width: `${(item.lastReadChapter / item.overallChapters) * 100}%`,
              }}
            />
          </View>
        ) : (
          <Text className="text-zinc-400 font-medium text-sm mt-auto">
            You've read all chapters
          </Text>
        )}
      </View>
    </Pressable>
  );
};
