import { useState } from "react";

import { Text, Modal, View } from "react-native";
import { Button } from "../button";

import { FilterKeys, FiltersConstants } from "@/types/filters";
import { ModalWrapper } from "./modal-wrapper";
import { useFiltersStore } from "@/hooks/useFiltersStore";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react-native";
import { exclude_filters, presentation_mode } from "@/constants/app.constants";
import i18n from "@/lib/intl";

const FilterButton = ({
  setOpen,
  label,
  length,
}: {
  setOpen: (b: boolean) => void;
  label: string;
  length: number;
}) => {
  return (
    <Button
      asChild
      withoutTransition
      onPress={() => setOpen(true)}
      style={{
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        flexDirection: "row",
        padding: 10,
        borderRadius: 6,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "rgb(191,191,191)", fontWeight: "600" }}>
        {label}
      </Text>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: "rgb(191,191,191)",
            fontWeight: "600",
            marginRight: 8,
          }}
        >
          {i18n.t("search.selected", { count: length })}
        </Text>
        <ChevronRight strokeWidth={2.5} color="rgb(191,191,191)" size={16} />
      </View>
    </Button>
  );
};

export const DynamicFiltersPicker = ({
  filterKey,
  label,
}: {
  filterKey: FilterKeys;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  const { filters: filtersStore, setFilters } = useFiltersStore();

  const { data: filters } = useQuery<FiltersConstants>({
    queryKey: ["filters-constants"],
  });

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

  return (
    <>
      <FilterButton
        setOpen={setOpen}
        label={label}
        length={filtersStore[filterKey].length}
      />
      <Modal animationType="slide" visible={open} presentationStyle="pageSheet">
        <ModalWrapper
          scrollable
          title={i18n.t("search.genres")}
          setOpen={setOpen}
        >
          <Button
            onPress={() => setFilters({ ...filtersStore, [filterKey]: [] })}
            asChild
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: 2,
              marginBottom: 4,
              padding: 8,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              {i18n.t("search.clear")}
            </Text>
          </Button>
          {filters![filterKey].map((filter) => {
            if (
              presentation_mode &&
              (!filter.site_ids.includes(4) || !filter.site_ids.includes(2))
            )
              return;

            if (
              presentation_mode &&
              exclude_filters.includes(filter.name!.toLowerCase())
            )
              return;

            return (
              <Button
                onPress={() => addToFilter(filter.id)}
                asChild
                style={{
                  backgroundColor: filtersStore[filterKey].includes(filter.id)
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.1)",
                  marginBottom: 4,
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "white" }}>{filter.name}</Text>
              </Button>
            );
          })}
          <View style={{ height: 60 }}></View>
        </ModalWrapper>
      </Modal>
    </>
  );
};
