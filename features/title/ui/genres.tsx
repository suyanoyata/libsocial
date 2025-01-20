import { Genre } from "@/features/shared/types/title";
import { TitleGenre } from "@/features/title/components/title-genre";
import { View } from "react-native";

export const Genres = ({ genres }: { genres: Genre[] }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {genres.map((genre) => (
        <TitleGenre genre={genre} key={genre.id} />
      ))}
    </View>
  );
};
