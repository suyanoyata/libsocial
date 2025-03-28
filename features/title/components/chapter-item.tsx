import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

import { Chapter as ChapterType } from "@/features/shared/types/chapter";
import { router, useFocusEffect } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { Bookmark, EyeIcon, EyeOff } from "lucide-react-native";
import { memo, useCallback, useLayoutEffect, useMemo, useState, useTransition } from "react";
import { useReadingTracker } from "@/store/use-reading-tracker";
import { biggest } from "@/lib/utils";
import Animated, { BounceIn } from "react-native-reanimated";

import { actionToast } from "@/features/title/lib/action-toast";

export const Chapter = memo(
  ({ slug_url, index, chapter }: { slug_url: string; index: number; chapter: ChapterType }) => {
    const { add, get, remove, getReadChapters } = useTitleReadChapter();
    const { get: getLastReadChapter, updateLastReadChapter } = useReadingTracker();
    const lastRead = getLastReadChapter(slug_url);

    const [read, setRead] = useState(get(slug_url, index));

    const [isPending, startTransition] = useTransition();

    const readCallback = useCallback(() => {
      setRead(get(slug_url, index));
    }, [index]);

    const isCurrentLastReadChapter = lastRead && lastRead.lastReadChapter - 1 == index;

    useFocusEffect(readCallback);
    useLayoutEffect(readCallback, [index]);

    const changeCallback = useCallback(() => {
      if (!read) {
        add(slug_url, index);
      } else {
        remove(slug_url, index);
      }
      updateLastReadChapter(slug_url, biggest(getReadChapters(slug_url)!));

      actionToast(
        "read",
        lastRead!?.lastReadChapter <= index,
        `Marked Volume ${chapter.volume} Chapter ${chapter.number} as ${read ? "unread" : "read"}`,
        read
      );
    }, [read]);

    const ReadIcon = useMemo(() => (read ? EyeIcon : EyeOff), [read]);

    return (
      <Pressable
        onPress={() => {
          if (isPending) return;
          setRead(true);

          startTransition(() => {
            impactAsync(ImpactFeedbackStyle.Soft);
            router.back();
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
            setRead((prev) => !prev);

            startTransition(() => changeCallback());
          }}
        >
          {isCurrentLastReadChapter ? (
            <Animated.View entering={BounceIn.duration(500)}>
              <Bookmark size={18} className="text-red-500 fill-red-500" />
            </Animated.View>
          ) : (
            <ReadIcon className="text-zinc-500" size={20} />
          )}
        </Pressable>
        <Text className="text-zinc-200">
          Volume {chapter.volume} Chapter {chapter.number}
        </Text>
      </Pressable>
    );
  }
);
