import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

import { Genre } from "@/features/shared/types/title";
import { cn } from "@/lib/utils";

export const TitleGenre = ({ genre }: { genre: Genre }) => {
  return (
    <Pressable
      className={cn(
        "bg-zinc-800/60 border border-zinc-800 rounded-lg p-1 px-2",
        genre.adult && "bg-red-200/10"
      )}
    >
      <Text className={cn("text-white text-sm", genre.adult && "text-red-400/90")}>
        {genre.name}
      </Text>
    </Pressable>
  );
};
