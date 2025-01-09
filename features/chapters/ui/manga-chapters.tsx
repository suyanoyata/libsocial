import { useEffect } from "react";

import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { storage } from "@/features/shared/lib/storage";

import { Loader } from "@/components/fullscreen-loader";

import { ChapterItem } from "@/features/chapters/components/chapter-item";
import { ChaptersLoadError } from "@/features/chapters/components/chapters-load-error";

import { useChapters } from "@/features/chapters/api/useChapters";

import { Chapter } from "@/features/chapters/types/manga-chapter";

type MangaChaptersProps = {
  selected: string;
  slug_url: string;
  type: string;
};

export const MangaChapters = ({
  selected,
  slug_url,
  type,
}: MangaChaptersProps) => {
  if (slug_url.startsWith("anime")) return;

  const { data, isLoading, error } = useChapters(slug_url);

  const slugStorage = storage.getString(slug_url);

  useEffect(() => {
    if (slugStorage == undefined) {
      storage.set(slug_url, JSON.stringify([]));
    }
  }, [slug_url]);

  if (selected == "chapters") {
    if (isLoading) return <Loader />;
    if (error) return <ChaptersLoadError slug_url={slug_url} />;

    return (
      <View
        style={{
          marginVertical: 12,
          marginHorizontal: 12,
        }}
      >
        <Animated.FlatList
          scrollEnabled={false}
          entering={FadeIn}
          data={data}
          renderItem={({ item, index }: { item: Chapter; index: number }) => (
            <ChapterItem
              type={type}
              slug_url={slug_url}
              index={index}
              chapter={item}
            />
          )}
        />
      </View>
    );
  }
};
