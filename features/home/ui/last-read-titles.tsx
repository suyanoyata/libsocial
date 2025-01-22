import { Trash2 } from "lucide-react-native";
import { View, Text, ScrollView } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";

import { Button } from "@/components/ui/button";
import { LastReadTitleCard } from "@/features/home/components/last-read-title-card";

import { useReadingTracker } from "@/store/use-reading-tracker";

export const LastReadTitles = () => {
  const { lastReadItems, reset } = useReadingTracker();

  if (lastReadItems.length == 0) return null;

  return (
    <Animated.View entering={FadeIn}>
      <View className="flex-row items-center justify-between mx-2 mt-3">
        <Text className="text-3xl font-extrabold text-white">You've stopped at</Text>
        <Button
          onPress={() => reset()}
          iconLeft={<Trash2 size={18} color="white" />}
          variant="destructive"
        >
          Clear all
        </Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mx-2 mt-4"
        contentContainerClassName="gap-4"
      >
        {lastReadItems.map((item) => (
          <LastReadTitleCard key={item.slug_url} item={item} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};
