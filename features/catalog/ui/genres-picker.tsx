import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/modal-wrapper";

import { BasicFilter } from "@/types/filters";
import i18n from "@/lib/intl";
import { Queries } from "@/hooks/queries";

import { useFiltersStore } from "@/features/catalog/store/useFiltersStore";
import { FilterComponent } from "@/features/catalog/components/filter-component";

export const FiltersGenrePicker = () => {
  const { filters: filtersStore, setFilters } = useFiltersStore();

  const { data: filters } = Queries.filterConstants();

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
        {filters["genres"].map((filter: BasicFilter) => (
          <FilterComponent key={filter.id} filter={filter} />
        ))}
      </View>
      <View style={{ height: 60 }} />
    </ModalWrapper>
  );
};
