import { Queries } from "@/hooks/queries";

import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Loader } from "@/components/fullscreen-loader";

import { ChapterInfo } from "@/features/reader/components/chapter-info";
import { MangaReaderImage } from "@/features/reader/components/reader-image";
import { ChapterBackButton } from "@/features/reader/components/chapter-back-button";
import { ReaderChapterNavigation } from "@/features/reader/components/reader-chapter-navigation-button";
import { ChapterServerSelectButton } from "@/features/reader/components/chapter-server-select-button";

import { useChapterTracker } from "@/features/reader/hooks/useChapterTracker";

import { MangaRoute } from "@/features/reader/types/manga-route";
import { useReaderAPI } from "@/features/reader/api/useReaderAPI";

export default function MangaReader() {
  const route = useRoute();
  const { slug_url, volume, number, chapterIndex, chapters } =
    route.params as MangaRoute;

  const { data, isLoading } = useReaderAPI("manga", slug_url, volume, number);

  useChapterTracker(chapterIndex, chapters, slug_url);

  const [loadLimit, setLoadLimit] = useState(6);

  if (isLoading) {
    return <Loader />;
  }

  if (!data) return;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.ScrollView
        entering={FadeIn}
        contentContainerStyle={{
          gap: 3,
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            marginHorizontal: 8,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ChapterBackButton />
          <ChapterInfo slug_url={slug_url} volume={volume} chapter={number} />
          <ChapterServerSelectButton slug_url={slug_url} />
        </View>
        <View style={{ alignItems: "center" }}>
          {data.pages.map((page, index) => (
            <MangaReaderImage
              key={page.url}
              page={page}
              setLoadLimit={setLoadLimit}
              index={index}
              loadLimit={loadLimit}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
            marginTop: 12,
            gap: 12,
          }}
        >
          <ReaderChapterNavigation
            direction="backward"
            chapters={chapters}
            chapterIndex={chapterIndex}
            slug_url={slug_url}
          />
          <ReaderChapterNavigation
            chapters={chapters}
            chapterIndex={chapterIndex}
            slug_url={slug_url}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
