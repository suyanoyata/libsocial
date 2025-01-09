import { View } from "react-native";

import {
  GenreComponent,
  IGenre,
} from "@/features/shared/components/genre-component";

export const Genres = ({ genres }: { genres: IGenre[] }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        flexWrap: "wrap",
        marginHorizontal: 6,
        marginTop: 6,
      }}
    >
      {genres.map((genre) => (
        <GenreComponent key={genre.id} genre={genre} />
      ))}
    </View>
  );
};
