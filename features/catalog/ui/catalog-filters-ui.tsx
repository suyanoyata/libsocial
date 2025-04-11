import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

import { Checkbox } from "@/components/ui/checkbox";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { useGenresConstants } from "@/features/shared/api/use-filter-constants";

import { memo, useCallback } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { useDeferredRender } from "@/hooks/use-deferred-render";

const GenreRender = memo(
  ({ item }: { item: { name: string; id: number } }) => {
    const checked = useFilterStore((state) => state.genres.includes(item.id));
    const addGenre = useFilterStore((state) => state.addGenre);
    const removeGenre = useFilterStore((state) => state.removeGenre);

    const handlePress = useCallback(() => {
      if (checked) {
        removeGenre(item.id);
      } else {
        addGenre(item.id);
      }
    }, [checked, item.id, removeGenre, addGenre]);

    return (
      <Pressable onPress={handlePress} className="flex-row items-center gap-2">
        <Checkbox checked={checked} />
        <Text className="text-zinc-200 font-medium text-base">{item.name}</Text>
      </Pressable>
    );
  },
  (prev, next) => prev.item.id === next.item.id
);

export const CatalogGenresFilter = () => {
  const { data } = useGenresConstants();

  const { bottom } = useSafeAreaInsets();
  const enabled = useDeferredRender();

  const renderItem = ({ item }: { item: { name: string; id: number } }) => (
    <GenreRender item={item} />
  );

  const keyExtractor = (item: { id: number }) => item.id.toString();

  return (
    <View className="flex-1 mt-3 mx-4">
      {enabled && (
        <Animated.FlatList
          entering={FadeIn}
          className="h-screen"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            index,
            length: 23,
            offset: index * 23,
          })}
          contentContainerStyle={{
            gap: 8,
            paddingBottom: bottom + 4,
          }}
          removeClippedSubviews
          initialNumToRender={30}
          keyExtractor={keyExtractor}
          data={data}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};
