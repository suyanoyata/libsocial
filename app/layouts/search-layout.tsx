import { useCatalogSearchStore } from "@/features/catalog/hooks/useCatalogSearchStore";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

import { SafeAreaView, Text, View } from "react-native";

import { CatalogSearch } from "@/features/catalog/components/search-field";

import { Button } from "@/components/ui/button";
import i18n from "@/lib/intl";
import { router } from "expo-router";
import SearchFiltersTrigger from "@/features/catalog/ui/filters-modal-trigger";

const SearchLayout = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const value = useDebounce(search, 500);

  const { setSearch: setStoreSearch } = useCatalogSearchStore();

  useEffect(() => {
    setStoreSearch(value);
  }, [value]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 8,
        marginHorizontal: 8,
      }}
    >
      <View
        style={{ flexDirection: "row", gap: 6, justifyContent: "flex-end" }}
      >
        <Button
          asChild
          style={{
            width: "auto",
            marginBottom: 8,
          }}
          onPress={() => router.push("/sort-picker-modal")}
        >
          <Text
            style={{
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.06)",
              paddingVertical: 10,
              paddingHorizontal: 16,
              textAlign: "center",
              color: "rgb(70,70,70)",
              fontWeight: "500",
            }}
          >
            {i18n.t("search.sort")}
          </Text>
        </Button>
        <SearchFiltersTrigger />
      </View>
      <CatalogSearch setSearch={setSearch} />
      {children}
    </SafeAreaView>
  );
};

export default SearchLayout;
