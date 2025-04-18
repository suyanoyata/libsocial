import { Trash2 } from "lucide-react-native";
import { View, ScrollView, FlatList } from "react-native";

import { Text } from "@/components/ui/text";

import Animated, { FadeIn } from "react-native-reanimated";

import { Button } from "@/components/ui/button";

import { LastWatchItem, useWatchTracker } from "@/store/use-watch-tracker";
import { useProperties } from "@/store/use-properties";
import { LastWatchedTitleCard } from "@/features/home/components/last-watched-title-card";
import { useMemo } from "react";

export const LastWatchTitles = () => {
  const { lastWatchItems, reset } = useWatchTracker();

  const { siteId } = useProperties();

  const renderItem = ({ item }: { item: LastWatchItem }) => <LastWatchedTitleCard item={item} />;
  const keyExtractor = (item: LastWatchItem) => item.slug_url;

  const visibleItems = useMemo(
    () => lastWatchItems.filter((i) => i.hide == false),
    [lastWatchItems]
  );

  if (visibleItems.length == 0 || siteId != "5") return null;

  return (
    <Animated.View entering={FadeIn} className="mx-2">
      <View className="flex-row items-center justify-between mt-3">
        <Text className="recent-viewed-title">You've stopped at</Text>
        <Button
          textClassName="max-sm:text-sm"
          onPress={() => reset()}
          iconLeft={<Trash2 size={18} color="white" />}
          variant="destructive"
        >
          Clear all
        </Button>
      </View>
      <View className="flex-row mt-4">
        <FlatList
          contentContainerClassName="gap-4"
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          data={lastWatchItems}
        />
      </View>
    </Animated.View>
  );
};
