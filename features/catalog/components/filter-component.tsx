import { Text } from "react-native";
import { Check } from "lucide-react-native";

import { Button } from "@/components/ui/button";

import { exclude_filters, presentation_mode } from "@/constants/app.constants";

import { useFiltersStore } from "@/features/catalog/store/useFiltersStore";

import { useAddToFilters } from "@/features/catalog/hooks/useAddToFilters";
import i18n from "@/lib/intl";
import { BasicFilter } from "@/types/filters";
import { logger } from "@/lib/logger";

export const FilterComponent = ({ filter }: { filter: BasicFilter }) => {
  const { filters } = useFiltersStore();

  const { setId: addToFilter } = useAddToFilters("genres");

  const presentationMode = (filter: BasicFilter) =>
    presentation_mode &&
    (!filter.site_ids.includes(4) || !filter.site_ids.includes(2));
  const excludedFilter = (filter: BasicFilter) =>
    presentation_mode && exclude_filters.includes(filter.name!.toLowerCase());

  // if (
  //   presentation_mode &&
  //   (!filter.site_ids.includes(4) || !filter.site_ids.includes(2))
  // ) {
  //   logger.verbose(
  //     `${filter.name} was excluded due to being included in hentai sites`
  //   );
  // }

  if (presentationMode(filter) || excludedFilter(filter)) return;

  return (
    <Button
      animationDisabled
      onPress={() => addToFilter(filter.id)}
      asChild
      style={{
        backgroundColor: filters["genres"].includes(filter.id)
          ? "rgba(255,255,255,0.2)"
          : "rgba(255,255,255,0.1)",
        marginBottom: 4,
        padding: 11,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingLeft: 36,
        position: "relative",
      }}
    >
      {filters["genres"].includes(filter.id) && (
        <Check
          style={{ position: "absolute", left: 12 }}
          color="white"
          size={16}
          strokeWidth={3}
        />
      )}
      <Text
        style={{
          color: "white",
        }}
      >
        {i18n.exists(`genres.${filter.id}`) && i18n.t(`genres.${filter.id}`)}
        {!i18n.exists(`genres.${filter.id}`) && `${filter.name} (${filter.id})`}
      </Text>
    </Button>
  );
};
