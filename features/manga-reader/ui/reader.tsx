import { FadeView } from "@/components/ui/fade-view";

import { ReaderChapterNavigation } from "@/features/manga-reader/components/reader-chapter-navigation";
import { ReaderHeader } from "@/features/manga-reader/components/reader-header";

import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, FlatList, useWindowDimensions, View } from "react-native";

import { useReadingTracker } from "@/store/use-reading-tracker";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { useProperties } from "@/store/use-properties";

import { useChapter } from "@/features/manga-reader/api/use-chapter";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useChapters } from "@/features/title/api/use-chapters";

import { Text } from "@/components/ui/text";
import { MenuView } from "@react-native-menu/menu";

import { readerPropsSchema } from "@/features/manga-reader/types/reader-route";

import { preloadNextChapter } from "@/features/manga-reader/lib/preload-chapter";
import { BackButton } from "@/components/ui/back-button";

import { ReaderImage } from "@/features/manga-reader/components/reader-image";
import { useReaderScrollTo } from "@/features/manga-reader/hooks/use-reader-scroll-to";
import withBubble from "@/components/ui/withBubble";
import { SearchX } from "lucide-react-native";

export const MangaReaderUI = () => {
  const route = useRoute();

  const { width } = useWindowDimensions();
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { readerImagePadding, readerDisplayCurrentPage, showReaderScrollbar } = useProperties();

  const { addItem } = useReadingTracker();
  const { add } = useTitleReadChapter();

  const { slug_url, index } = route.params as {
    slug_url: string;
    index: string;
  };

  const chapterIndex = Number(index);

  const { error } = useMemo(
    () => readerPropsSchema.safeParse({ slug_url, index }),
    [index, slug_url]
  );

  useEffect(() => {
    setTimeout(() => {
      add(slug_url, chapterIndex);
    }, 50);
  }, []);

  const { data: title } = useTitleInfo(slug_url, "1");
  const { data: chapters } = useChapters(slug_url, title?.site);

  const nextChapter = chapters && chapters[chapterIndex + 1];

  const { flatListRef, scroll } = useReaderScrollTo(slug_url, chapterIndex);

  const { data, refetch, isFetching, isError } = useChapter(
    slug_url,
    chapters && chapters[chapterIndex]
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isError) return;

    if (!isFetching && data && data.pages.length == 0) {
      timeoutId = setTimeout(() => {
        refetch();
      }, 500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data, isFetching, isError]);

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
      site: Number(title.site),
      scrollTo: offset,
    });
  }, [slug_url, title, data, offset]);

  useEffect(() => {
    if (data) scroll();
  }, [data]);

  const preloadChapter = useCallback(
    () => preloadNextChapter(slug_url, nextChapter),
    [nextChapter, slug_url]
  );

  const keyExtractor = (item: { url: string; ratio: number }) => item.url;

  const renderItem = ({ item }: { item: { url: string; ratio: number } }) => (
    <ReaderImage url={item.url} ratio={item.ratio} />
  );

  const ErrorIcon = withBubble(SearchX);

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <BackButton />
        <ErrorIcon />
        <Text className="text-white/80 mt-2">Something went wrong</Text>
        <Text className="text-white/60 mt-2 text-sm font-medium">
          Chapter is licensed or not found
        </Text>
      </View>
    );
  }

  if (!chapters || !title) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (data && data.pages.length == 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <BackButton />
        <ActivityIndicator size="small" color="white" />
        <Text className="text-zinc-200 mt-2">Chapter is downloading, hang on...</Text>
      </View>
    );
  }

  if (!data) return;

  return (
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
        viewabilityConfig={{
          minimumViewTime: 3,
          waitForInteraction: false,
          viewAreaCoveragePercentThreshold: 0.4,
        }}
        onViewableItemsChanged={(event) => {
          if (event.changed[0].index && event.changed[0].isViewable) {
            setCurrentPage(event.changed[0].index);
          }
        }}
        keyExtractor={keyExtractor}
        onMomentumScrollEnd={(event) => setOffset(event.nativeEvent.contentOffset.y)}
        maxToRenderPerBatch={6}
        initialNumToRender={5}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        onEndReached={preloadChapter}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={showReaderScrollbar}
        ListHeaderComponent={() => <ReaderHeader chapter={data} title={title} />}
        ListFooterComponent={() => (
          <ReaderChapterNavigation chapterIndex={chapterIndex} chapters={chapters} />
        )}
        style={{ width }}
        data={data.pages}
        renderItem={renderItem}
      />
    </FadeView>
  );
};
