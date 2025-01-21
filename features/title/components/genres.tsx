import { Genre } from "@/features/shared/types/title";
import { TitleGenre } from "@/features/title/components/title-genre";
import { Text, View } from "react-native";

export const Genres = ({
  genres,
  ageRestriction,
}: {
  genres: Genre[];
  ageRestriction: { id: number; label: string };
}) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {ageRestriction?.id > 2 && (
        <TitleGenre
          genre={{
            adult: true,
            name: ageRestriction.label,
            id: ageRestriction.id,
          }}
        />
      )}
      {genres.map((genre) => (
        <TitleGenre
          genre={{
            ...genre,
            adult: false,
          }}
          key={genre.id}
        />
      ))}
    </View>
  );
};
