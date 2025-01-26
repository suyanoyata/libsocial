import { FlatList, Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { useGenresConstants } from "@/features/shared/api/use-filter-constants";
import { Checkbox } from "tamagui";
import { CheckIcon } from "lucide-react-native";
import { useState } from "react";

const GenreRender = ({ item }: { item: { name: string; id: number } }) => {
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
      <Checkbox checked={checked}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>
      <Text className="text-zinc-200 font-medium text-lg">{item.name}</Text>
    </Pressable>
  );
};

export const CatalogFiltersUI = () => {
  const { data } = useGenresConstants();

  return (
    <ModalWrapper>
      <View className="flex-1 mx-4 mt-3">
        <FlatList
          contentContainerStyle={{
            gap: 8,
          }}
          data={data}
          initialNumToRender={30}
          renderItem={({ item }) => <GenreRender item={item} />}
        />
      </View>
    </ModalWrapper>
  );
};
