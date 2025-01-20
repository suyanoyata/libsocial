import { Pressable, Text } from "react-native";

import { Genre } from "@/features/shared/types/title";

export const TitleGenre = ({ genre }: { genre: Genre }) => {
  return (
    <Pressable className="bg-zinc-800/60 border border-zinc-800 rounded-lg p-1">
      <Text className="text-white text-sm">{genre.name}</Text>
    </Pressable>
  );
};
