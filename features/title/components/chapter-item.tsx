import { Pressable, Text } from "react-native";

import { Chapter as ChapterType } from "@/features/shared/types/chapter";
import { Link, router } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

export const Chapter = ({
  slug_url,
  index,
  chapter,
}: {
  slug_url: string;
  index: number;
  chapter: ChapterType;
}) => {
  return (
    <Pressable
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Soft);
        router.navigate({
          pathname: "/manga-reader",
          params: {
            slug_url,
            index,
          },
        });
      }}
      className="h-11 bg-zinc-900 active:bg-zinc-800 mb-2 justify-center px-4 rounded-lg"
    >
      <Text className="text-zinc-200">
        Том {chapter.volume} Глава {chapter.number}
      </Text>
    </Pressable>
  );
};
