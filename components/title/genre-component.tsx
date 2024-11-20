import { site_id } from "@/lib/axios";
import { Text, View } from "react-native";
import { Button } from "../button";
import { Link, useNavigation } from "expo-router";
import { useFiltersStore } from "@/hooks/useFiltersStore";

export type IGenre = {
  id: number;
  name: string;
  adult: boolean;
};

export const GenreComponent = ({ genre }: { genre: IGenre }) => {
  const router: any = useNavigation();
  const { filters, setFilters } = useFiltersStore();
  // TODO: add toggle for presentation mode to hide adult genres?
  // if (genre.adult && Number(site_id) !== 4) return null;
  return (
    <Link href="/(tabs)/search" asChild>
      <Button
        asChild
        onPress={() => {
          setFilters({
            ...filters,
            genres: [genre.id],
          });
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            padding: 6,
            paddingHorizontal: 8,
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "rgb(191,191,191)", fontWeight: "500" }}>
            {genre.name}
          </Text>
        </View>
      </Button>
    </Link>
  );
};
