import { Pressable } from "react-native";
import { router } from "expo-router";

import { Text } from "@/components/ui/text";

import { Genre } from "@/features/shared/types/title";
import { cn } from "@/lib/utils";

import { useFilterStore } from "@/features/catalog/store/use-filter-store";

export const TitleGenre = ({ genre }: { genre: Genre }) => {
  const { resetGenresWithId } = useFilterStore();

  const handleGenrePress = () => {
    resetGenresWithId(genre.id);
    router.dismissTo("/catalog");
  };

  return (
    <Pressable
      onPress={handleGenrePress}
      className={cn(
        "bg-zinc-800/60 border border-zinc-800 rounded-lg p-1 px-2 active:bg-zinc-800/80",
        genre.adult && "bg-red-200/10"
      )}
    >
      <Text className={cn("text-white text-sm", genre.adult && "text-red-400/90")}>
        {genre.name}
      </Text>
    </Pressable>
  );
};
