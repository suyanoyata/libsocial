import { Text, View } from "react-native";
import { Button } from "../../../components/ui/button";
import { Link, useNavigation } from "expo-router";
import { useFiltersStore } from "@/features/catalog/hooks/useFiltersStore";
import i18n from "@/lib/intl";
import { presentation_mode } from "@/constants/app.constants";

export type IGenre = {
  id: number;
  name: string;
  adult: boolean;
};

export const GenreComponent = ({ genre }: { genre: IGenre }) => {
  const { filters, setFilters } = useFiltersStore();

  if (presentation_mode && !__DEV__ && !i18n.exists(`genres.${genre.id}`))
    return null;

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
            {i18n.exists(`genres.${genre.id}`)
              ? i18n.t(`genres.${genre.id}`)
              : `${genre.name} (${genre.id})`}
          </Text>
        </View>
      </Button>
    </Link>
  );
};
