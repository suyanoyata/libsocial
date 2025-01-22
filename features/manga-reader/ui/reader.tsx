import { FadeView } from "@/components/ui/fade-view";

import { ReaderChapterNavigation } from "@/features/manga-reader/components/reader-chapter-navigation";
import { ReaderHeader } from "@/features/manga-reader/components/reader-header";

import { Image } from "expo-image";

import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, FlatList, useWindowDimensions, View } from "react-native";

import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { useProperties } from "@/store/use-properties";

import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useChapter } from "@/features/manga-reader/api/use-chapter";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useChapters } from "@/features/title/api/use-chapters";

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";

import { api } from "@/lib/axios";

export const MangaReaderUI = () => {
  const route = useRoute();

  const { width } = useWindowDimensions();
  const [offset, setOffset] = useState(0);

  const queryClient = useQueryClient();
  const { currentImageServerIndex, readerImagePadding } = useProperties();
  const { data: imageServers } = useImageServers();

  const { addItem, get } = useReadingTracker();
  const { add } = useTitleReadChapter();

  const { slug_url, index } = route.params as {
    slug_url: string;
    index: string;
  };

  const chapterIndex = Number(index);

  // #region route arguments error handling
  if (!slug_url || !index) {
    console.error({
      slug_url,
      index,
    });
    throw new Error("Missing required params");
  }

  if (typeof slug_url !== "string" || typeof index !== "string") {
    throw new Error("Route params types are mismatched");
  }
  // #endregion

  useEffect(() => {
    setTimeout(() => {
      add(slug_url, chapterIndex);
    }, 50);
  }, []);

  const { data: title } = useTitleInfo(slug_url, "1");

  const { data: chapters } = useChapters(slug_url);

  const nextChapter = chapters && chapters[chapterIndex + 1];

  const flatListRef = useRef<FlatList>(null);

  const { data } = useChapter(slug_url, chapters && chapters[chapterIndex]);

  useEffect(() => {
    if (!title || !chapters) return;
    addItem({
      slug_url,
      title: title.eng_name ?? title.name,
      lastReadChapter: chapterIndex,
      overallChapters: chapters.length,
      cover: {
        default: title.cover.default,
      },
      site: title.site,
      scrollTo: offset,
    });
  }, [slug_url, title, data, offset]);

  useEffect(() => {
    const item = get(slug_url) as unknown as LastReadItem;

    if (!data || !flatListRef || !item) return;

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        animated: false,
        offset: item.scrollTo,
      });
    }, 250);
  }, [data, flatListRef]);

  if (!chapters || !title) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!imageServers) return null;

  return (
    data && (
      <FadeView withEnter className="flex-1 items-center justify-center">
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{
            gap: readerImagePadding,
          }}
          onScroll={(event) => setOffset(event.nativeEvent.contentOffset.y)}
          onMomentumScrollEnd={(event) => setOffset(event.nativeEvent.contentOffset.y)}
          initialNumToRender={20}
          onEndReached={async () => {
            // FIXME: for some reason if we put this in function it will be not called
            if (nextChapter) {
              const response = await api
                .get(
                  `/manga/${slug_url}/chapter?volume=${nextChapter.volume}&number=${nextChapter.number}`
                )
                .then((res) => res.data.data)
                .catch((err) => console.error(err));

              console.log(response);

              queryClient.setQueryData<ReaderChapter>(
                [
                  "manga-chapter-reader",
                  slug_url,
                  nextChapter.volume,
                  nextChapter.number,
                ],
                response
              ),
                await Image.prefetch(
                  response.pages.map(
                    (page: { url: string }) => "https://img2.imglib.info" + page.url
                  ),
                  "disk"
                ),
                console.log("preloaded next chapter");
            }
          }}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={() => <ReaderHeader chapter={data} title={title} />}
          ListFooterComponent={() => (
            <ReaderChapterNavigation chapterIndex={chapterIndex} chapters={chapters} />
          )}
          data={data.pages}
          renderItem={({ item }) => (
            <Image
              style={{
                width,
                height: width / item.ratio,
              }}
              source={{
                uri: imageServers[currentImageServerIndex].url + item.url,
                recyclingKey: imageServers[currentImageServerIndex].url + item.url,
              }}
            />
          )}
        />
      </FadeView>
    )
  );
};
