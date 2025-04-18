import { View } from "react-native";
import { Text } from "@/components/ui/text";

import { router } from "expo-router";

import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

export default function CatalogFiltersView() {
  const { genres, reset } = useFilterStore();

  const { bottom } = useSafeAreaInsets();

  return (
    <View className="mt-3 mx-2 flex-1" style={{ paddingBottom: bottom + 12 }}>
      <Button
        asChild
        variant="ghost"
        onPress={() => {
          router.push("/catalog-filters-genres");
        }}
        className="flex-row items-center justify-between py-3 w-full"
      >
        <Text className="text-secondary font-semibold">Genres</Text>
        <Text className="text-muted font-medium">{genres.length} selected</Text>
      </Button>
      <Button
        disabled={genres.length == 0}
        onPress={reset}
        className={cn("mt-auto", genres.length == 0 && "opacity-80 active:bg-red-500")}
        variant="destructive"
        iconLeft={<Trash2 color="white" size={18} />}
      >
        Clear all
      </Button>
    </View>
  );
}
