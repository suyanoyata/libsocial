import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

import { Chapter as ChapterType } from "@/features/shared/types/chapter";
import { router } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { EyeIcon, EyeOff } from "lucide-react-native";
import { useCallback, useLayoutEffect, useState, useTransition } from "react";

export const Chapter = ({
  slug_url,
  index,
  chapter,
}: {
  slug_url: string;
  index: number;
  chapter: ChapterType;
}) => {
  const { add, get, remove } = useTitleReadChapter();

  const [read, setRead] = useState(get(slug_url, index) as unknown as boolean);

  const [isPending, startTransition] = useTransition();

  const readCallback = useCallback(() => {
    setRead(get(slug_url, index) as unknown as boolean);
  }, [index]);

  useLayoutEffect(readCallback, [index]);

  return (
    <Pressable
      onPress={() => {
        if (isPending) return;

        startTransition(() => {
          setRead(true);
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
          if (!read) {
            setRead(true);
            add(slug_url, index);
          } else {
            setRead(false);
            remove(slug_url, index);
          }
        }}
      >
        {read ? (
          <EyeIcon className="text-zinc-500" size={20} />
        ) : (
          <EyeOff className="text-zinc-500" size={20} />
        )}
      </Pressable>
      <Text className="text-zinc-200">
        Том {chapter.volume} Глава {chapter.number}
      </Text>
    </Pressable>
  );
};
