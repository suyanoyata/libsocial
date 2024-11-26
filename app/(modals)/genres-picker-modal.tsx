import { Text, View } from "react-native";
import { Button } from "@/components/button";

import { BasicFilter, FiltersConstants } from "@/types/filters";
import { ModalWrapper } from "@/components/filters/modal-wrapper";
import { useFiltersStore } from "@/hooks/useFiltersStore";
import { Check } from "lucide-react-native";
import { exclude_filters, presentation_mode } from "@/constants/app.constants";
import i18n from "@/lib/intl";
import { Queries } from "@/hooks/queries";

const GenresPicker = () => {
  const filterKey = "genres";
  const { filters: filtersStore, setFilters } = useFiltersStore();

  const { data: filters } = Queries.filterConstants();

  // NOTE: in dev mode this takes significant time, but on prod build it's fine
  const addToFilter = (id: number) => {
    if (filtersStore[filterKey].includes(id)) {
      setFilters({
        ...filtersStore,
        [filterKey]: filtersStore[filterKey].filter((item) => item !== id),
      });
      return;
    }
    setFilters({
      ...filtersStore,
      [filterKey]: [...filtersStore[filterKey], id],
    });
  };

  // prettier-ignore
  const presentationMode = (filter: BasicFilter) => presentation_mode && (!filter.site_ids.includes(4) || !filter.site_ids.includes(2));
  // prettier-ignore
  const excludedFilter = (filter: BasicFilter) => presentation_mode && exclude_filters.includes(filter.name!.toLowerCase());

  return (
    <ModalWrapper scrollable title={i18n.t("search.genres")}>
      <Button
        animationDisabled
        onPress={() => setFilters({ ...filtersStore, genres: [] })}
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 2,
          marginBottom: 8,
          padding: 8,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {i18n.t("search.clear")}
        </Text>
      </Button>
      <View style={{ maxWidth: "100%", gap: 4 }}>
        {filters["genres"].map((filter: BasicFilter) => {
          if (presentationMode(filter) || excludedFilter(filter)) return;

          return (
            <Button
              animationDisabled
              onPress={() => addToFilter(filter.id)}
              asChild
              style={{
                backgroundColor: filtersStore["genres"].includes(filter.id)
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
              {filtersStore["genres"].includes(filter.id) && (
                <Check
                  style={{ position: "absolute", left: 12 }}
                  color="white"
                  size={16}
                  strokeWidth={3}
                />
              )}
              {/* <Text style={{ color: "white" }}>{filter.name}</Text> */}
              <Text style={{ color: "white" }}>
                {i18n.exists(`genres.${filter.id}`) &&
                  i18n.t(`genres.${filter.id}`)}
                {!i18n.exists(`genres.${filter.id}`) &&
                  `${filter.name} (${filter.id})`}
              </Text>
            </Button>
          );
        })}
      </View>
      <View style={{ height: 60 }} />
    </ModalWrapper>
  );
};

export default GenresPicker;
