import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker";
import { useRef } from "react";
import { FlatList } from "react-native";

export const useReaderScrollTo = (slug_url: string, chapterIndex: number) => {
  const flatListRef = useRef<FlatList>(null);

  const { get } = useReadingTracker();

  const item = get(slug_url) as unknown as LastReadItem;

  const scroll = () => {
    if (!item || !flatListRef) return;

    if (item.lastReadChapter - 1 !== chapterIndex) return;

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        animated: false,
        offset: item.scrollTo,
      });
    }, 250);
  };

  return { flatListRef, scroll };
};
