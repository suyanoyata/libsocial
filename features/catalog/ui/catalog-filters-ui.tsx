import { FlatList, Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { useGenresConstants } from "@/features/shared/api/use-filter-constants";
import { Checkbox } from "tamagui";
import { CheckIcon } from "lucide-react-native";
import { memo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GenreRender = memo(
  ({ item }: { item: { name: string; id: number } }) => {
    const { genres, addGenre, removeGenre } = useFilterStore();

    const [checked, setChecked] = useState(genres.includes(item.id));

    const handlePress = () => {
      if (!checked) {
        setChecked(true);
        addGenre(item.id);
      } else {
        setChecked(false);
        removeGenre(item.id);
      }
    };

    return (
      <Pressable onPress={handlePress} className="flex-row items-center gap-2">
        <Checkbox size="$4.5" checked={checked}>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox>
        <Text className="text-zinc-200 font-medium text-base">{item.name}</Text>
      </Pressable>
    );
  },
  (prev, next) => prev.item.id === next.item.id
);

export const CatalogFiltersUI = () => {
  const { data } = useGenresConstants();

  const { bottom } = useSafeAreaInsets();

  const renderItem = ({ item }: { item: { name: string; id: number } }) => (
    <GenreRender item={item} />
  );

  return (
    <View className="flex-1 mt-3 mx-4">
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: bottom + 4,
        }}
        data={data}
        initialNumToRender={30}
        renderItem={renderItem}
      />
    </View>
  );
};
