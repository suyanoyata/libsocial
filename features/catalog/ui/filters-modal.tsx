import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { Loader } from "@/components/fullscreen-loader";
import { FilterButton } from "@/features/catalog/components/filter-navigation-button";
import { useFiltersStore } from "@/features/catalog/store/useFiltersStore";
import i18n from "@/lib/intl";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native";

export const Filters = () => {
  const { isFetching, isError } = useQuery({
    queryKey: ["filters-constants"],
  });
  const { filters } = useFiltersStore();

  if (isFetching || isError) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ModalWrapper title={i18n.t("search.filters")}>
          <Loader />
        </ModalWrapper>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ModalWrapper animated title={i18n.t("search.filters")}>
        <FilterButton
          label={i18n.t("search.genres")}
          length={filters.genres.length}
        />
      </ModalWrapper>
    </SafeAreaView>
  );
};
