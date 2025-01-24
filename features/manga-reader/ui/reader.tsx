import { FadeView } from "@/components/ui/fade-view";

import { ReaderChapterNavigation } from "@/features/manga-reader/components/reader-chapter-navigation";
import { ReaderHeader } from "@/features/manga-reader/components/reader-header";

import FastImage from "@d11/react-native-fast-image";

import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, FlatList, useWindowDimensions, View } from "react-native";

import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { useProperties } from "@/store/use-properties";

import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useChapter } from "@/features/manga-reader/api/use-chapter";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useChapters } from "@/features/title/api/use-chapters";

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";

import { api } from "@/lib/axios";
import { Text } from "@/components/ui/text";
import { MenuView } from "@react-native-menu/menu";

export const MangaReaderUI = () => {
  const route = useRoute();

  const { width } = useWindowDimensions();
  const [offset, setOffset] = useState(0);

  const queryClient = useQueryClient();
  const { currentImageServerIndex, readerImagePadding, readerDisplayCurrentPage } =
    useProperties();

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

  const [currentPage, setCurrentPage] = useState(1);

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

  const breakpoints = useMemo(() => {
    return data?.pages.reduce((acc: number[], page) => {
      const value = Math.round(width / page.ratio) + readerImagePadding;

      const lastValue = acc[acc.length - 1] || 0;
      acc.push(lastValue + value);
      return acc;
    }, []);
  }, [data?.pages]);

  useEffect(() => {
    const filtered = breakpoints?.filter((value) => value <= offset);

    if (filtered && filtered?.length != 0) {
      setCurrentPage(filtered.length);
    }
  }, [offset]);

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

  const preloadChapter = useCallback(async () => {
    if (nextChapter) {
      const response = await api
        .get(
          `/manga/${slug_url}/chapter?volume=${nextChapter.volume}&number=${nextChapter.number}`
        )
        .then((res) => res.data.data)
        .catch((err) => console.error(err));

      queryClient.setQueryData<ReaderChapter>(
        ["manga-chapter-reader", slug_url, nextChapter.volume, nextChapter.number],
        response
      ),
        FastImage.preload(
          response.pages.map(
            (page: { url: string }) => "https://img2.imglib.info" + page.url
          )
        );
    }
  }, [nextChapter, slug_url]);

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
        {readerDisplayCurrentPage && (
          <MenuView
            onPressAction={(event) =>
              flatListRef.current?.scrollToIndex({
                index: parseInt(event.nativeEvent.event),
                animated: true,
              })
            }
            style={{
              position: "absolute",
              left: 16,
              bottom: 16,
              zIndex: 20,
            }}
            actions={data.pages.map((_, index) => ({
              id: index.toString(),
              title: `${index + 1} / ${data.pages.length}`,
            }))}
          >
            <View className="bg-zinc-900/70 p-3 py-1.5 rounded-full">
              <Text className="text-zinc-200 font-semibold">
                {currentPage}/{data.pages.length}
              </Text>
            </View>
          </MenuView>
        )}
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{
            gap: readerImagePadding,
          }}
          onScroll={(event) => setOffset(event.nativeEvent.contentOffset.y)}
          onMomentumScrollEnd={(event) => setOffset(event.nativeEvent.contentOffset.y)}
          maxToRenderPerBatch={6}
          initialNumToRender={20}
          onEndReached={preloadChapter}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={() => <ReaderHeader chapter={data} title={title} />}
          ListFooterComponent={() => (
            <ReaderChapterNavigation chapterIndex={chapterIndex} chapters={chapters} />
          )}
          style={{ width }}
          data={data.pages}
          renderItem={({ item }) => (
            <FastImage
              resizeMode="contain"
              style={{
                marginHorizontal: "auto",
                width: width > 800 ? 800 : width,
                height: width > 800 ? 800 : width / item.ratio,
              }}
              source={{
                uri: imageServers[currentImageServerIndex].url + item.url,
              }}
            />
          )}
        />
      </FadeView>
    )
  );
};
