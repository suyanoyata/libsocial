import { FadeView } from "@/components/ui/fade-view";

import { useRoute } from "@react-navigation/native";
import { FlatList, useWindowDimensions, View } from "react-native";

import { useRef, useState } from "react";

import { useProperties } from "@/store/use-properties";

import { useDeferredRender } from "@/hooks/use-deferred-render";
import { Text } from "@/components/ui/text";
import { ReaderHeader } from "@/features/manga-reader/components/reader-header";
import { BackButton } from "@/components/ui/back-button";
import { useDownloads } from "@/features/downloads/store/use-downloads";
import { ReaderImage } from "@/features/manga-reader/components/reader-image";

import MenuView from "react-native-context-menu-view";

export const DownloadedReader = () => {
  const route = useRoute();

  const { slug_url, volume, chapter } = route.params as {
    slug_url: string;
    volume: string;
    chapter: string;
  };

  const get = useDownloads((state) => state.get);

  const data = get(slug_url, volume, chapter);

  const { width, height } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(1);

  const shouldRender = useDeferredRender();

  const { readerDisplayCurrentPage, showReaderScrollbar } = useProperties();

  const flatListRef = useRef<FlatList>(null);

  const keyExtractor = (item: { url: string; ratio: number }) => item.url;

  const renderItem = ({ item }: { item: { url: string; ratio: number } }) => (
    <ReaderImage url={item.url} ratio={item.ratio} />
  );

  if (!data) {
    return (
      <View className="items-center justify-center flex-1">
        <BackButton />
        <Text className="text-secondary font-medium">
          Couldn't find this chapter, try re-downloading it
        </Text>
      </View>
    );
  }

  if (!shouldRender) return null;

  return (
    <FadeView withEnter className="flex-1 items-center justify-center">
      {readerDisplayCurrentPage && (
        <MenuView
          dropdownMenuMode
          onPress={(event) => {
            flatListRef.current?.scrollToIndex({
              index: event.nativeEvent.index,
              animated: true,
            });
          }}
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            zIndex: 20,
          }}
          actions={data.chapter.pages.map((_, index) => ({
            id: index.toString(),
            title: `${index + 1} / ${data.chapter.pages.length}`,
          }))}
        >
          <View className="bg-zinc-900/70 p-3 py-1.5 rounded-full">
            <Text className="text-zinc-200 font-semibold">
              {currentPage}/{data.chapter.pages.length}
            </Text>
          </View>
        </MenuView>
      )}
      <FlatList
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
        ref={flatListRef}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={6}
        initialNumToRender={5}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        showsVerticalScrollIndicator={showReaderScrollbar}
        ListHeaderComponent={() => <ReaderHeader title={data.title} chapter={data.chapter} />}
        style={{ width, height }}
        data={data.chapter.pages}
        renderItem={renderItem}
      />
    </FadeView>
  );
};
