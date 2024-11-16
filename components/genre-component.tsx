import { site_id } from "@/lib/axios";
import { Text, View } from "react-native";

export type IGenre = {
  id: number;
  name: string;
  adult: boolean;
};

export const GenreComponent = ({ genre }: { genre: IGenre }) => {
  // TODO: add toggle for presentation mode to hide adult genres?
  // if (genre.adult && Number(site_id) !== 4) return null;
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: 8,
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white" }}>{genre.name}</Text>
    </View>
  );
};
