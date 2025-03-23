import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

import { Chapter as ChapterType } from "@/features/shared/types/chapter";
import { router, useFocusEffect } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { Bookmark, EyeIcon, EyeOff } from "lucide-react-native";
import { memo, useCallback, useLayoutEffect, useState, useTransition } from "react";
import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker";

export const Chapter = memo(
  ({ slug_url, index, chapter }: { slug_url: string; index: number; chapter: ChapterType }) => {
    const { add, get, remove } = useTitleReadChapter();
    const { get: getLastReadChapter } = useReadingTracker();
    const lastRead = getLastReadChapter(slug_url) as unknown as LastReadItem;

    const [read, setRead] = useState(get(slug_url, index) as unknown as boolean);

    const [isPending, startTransition] = useTransition();

    const readCallback = useCallback(() => {
      setRead(get(slug_url, index) as unknown as boolean);
    }, [index]);

    const isCurrentLastReadChapter = lastRead?.lastReadChapter - 1 == index;

    useFocusEffect(readCallback);
    useLayoutEffect(readCallback, [index]);

    const changeCallback = useCallback(() => {
      if (!read) {
        add(slug_url, index);
      } else {
        remove(slug_url, index);
      }
    }, [read]);

    return (
      <Pressable
        onPress={() => {
          if (isPending) return;
          setRead(true);

          startTransition(() => {
            impactAsync(ImpactFeedbackStyle.Soft);
            router.navigate({
              pathname: "/manga-reader",
              params: {
                slug_url,
                index,
              },
            });
          });
        }}
        className="flex-row items-center gap-2 h-11 bg-zinc-900 active:bg-zinc-800 mb-2 px-4 rounded-lg"
      >
        <Pressable
          hitSlop={10}
          onPress={() => {
            if (isCurrentLastReadChapter) return;

            setRead((prev) => !prev);

            startTransition(() => changeCallback());
          }}
        >
          {isCurrentLastReadChapter && <Bookmark size={18} className="text-red-500 fill-red-500" />}
          {!isCurrentLastReadChapter && read && <EyeIcon className="text-zinc-500" size={20} />}
          {!isCurrentLastReadChapter && !read && <EyeOff className="text-zinc-500" size={20} />}
        </Pressable>
        <Text className="text-zinc-200">
          Volume {chapter.volume} Chapter {chapter.number}
        </Text>
      </Pressable>
    );
  }
);
