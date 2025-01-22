import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

import { Chapter as ChapterType } from "@/features/shared/types/chapter";
import { router } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useTitleReadChapter } from "@/store/use-chapters-tracker";
import { EyeIcon, EyeOff } from "lucide-react-native";

export const Chapter = ({
  slug_url,
  index,
  chapter,
}: {
  slug_url: string;
  index: number;
  chapter: ChapterType;
}) => {
  const { get } = useTitleReadChapter();

  const read = get(slug_url, index) as unknown as boolean;

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
      className="flex-row items-center gap-2 h-11 bg-zinc-900 active:bg-zinc-800 mb-2 px-4 rounded-lg"
    >
      <View>
        {read ? (
          <EyeIcon className="text-zinc-500" size={20} />
        ) : (
          <EyeOff className="text-zinc-500" size={20} />
        )}
      </View>
      <Text className="text-zinc-200">
        Том {chapter.volume} Глава {chapter.number}
      </Text>
    </Pressable>
  );
};
