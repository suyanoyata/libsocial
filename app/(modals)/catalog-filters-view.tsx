import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

import { router } from "expo-router";

import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { Button } from "@/components/ui/button";

export default function CatalogFiltersView() {
  const { genres } = useFilterStore();

  return (
    <View className="mt-3 mx-4">
      <Button
        asChild
        variant="ghost"
        onPress={() => {
          router.push("/catalog-filters-genres");
        }}
        className="flex-row items-center justify-between py-3 w-full"
      >
        <Text className="text-zinc-200 font-medium">Genres</Text>
        <Text className="text-zinc-400 font-semibold">{genres.length} selected</Text>
      </Button>
    </View>
  );
}
