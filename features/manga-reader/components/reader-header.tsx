import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";
import { Title } from "@/features/shared/types/title";

import { router } from "expo-router";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Cog } from "lucide-react-native";

export const ReaderHeader = ({ chapter, title }: { chapter: ReaderChapter; title: Title }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: top + 8, paddingBottom: 8 }}
      className="px-3 flex-row items-center gap-2 bg-black"
    >
      <ChevronLeft onPress={() => router.back()} size={24} strokeWidth={3} color="#a1a1aa" />
      <View className="flex-1">
        <Text className="text-zinc-200 font-medium text-base">
          Volume {chapter.volume} Chapter {chapter.number}
        </Text>
        <Text numberOfLines={1} className="text-zinc-400 font-medium text-sm">
          {title.eng_name != "" ? title.eng_name : title.name}
        </Text>
      </View>
      <Cog
        hitSlop={10}
        onPress={() => {
          console.log("click");
          router.navigate("/reader-properties");
        }}
        color="#a1a1aa"
      />
    </View>
  );
};
