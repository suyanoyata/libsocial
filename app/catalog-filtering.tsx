import { Button } from "@/components/button";
import { ModalWrapper } from "@/components/filters/modal-wrapper";
import { useFiltersStore } from "@/hooks/useFiltersStore";
import i18n from "@/lib/intl";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { View, Text, SafeAreaView } from "react-native";

const FilterButton = ({ label, length }: { label: string; length: number }) => {
  return (
    <Link href="/genres-picker-modal" asChild>
      <Button
        asChild
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
    </Link>
  );
};

export default function CatalogFiltering() {
  const { filters } = useFiltersStore();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ModalWrapper scrollable title={i18n.t("search.filters")}>
        <FilterButton
          label={i18n.t("search.genres")}
          length={filters.genres.length}
        />
      </ModalWrapper>
    </SafeAreaView>
  );
}
