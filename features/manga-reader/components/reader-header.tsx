import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";
import { Chapter } from "@/features/shared/types/chapter";
import { Title } from "@/features/shared/types/title";
import { router } from "expo-router";
import { ChevronLeft, Cog } from "lucide-react-native";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ReaderHeader = ({
  chapter,
  title,
}: {
  chapter: ReaderChapter;
  title: Title;
}) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: top, paddingBottom: 8 }}
      className="mx-3 flex-row items-center gap-2"
    >
      <ChevronLeft
        onPress={() => router.back()}
        size={24}
        strokeWidth={3}
        color="#a1a1aa"
      />
      <View className="flex-1">
        <Text className="text-zinc-200 font-medium text-base">
          Том {chapter.volume} Глава {chapter.number}
        </Text>
        <Text numberOfLines={1} className="text-zinc-400 font-medium text-sm">
          {title.eng_name ?? title.name}
        </Text>
      </View>
      <Cog onPress={() => router.navigate("/reader-properties")} color="#a1a1aa" />
    </View>
  );
};
