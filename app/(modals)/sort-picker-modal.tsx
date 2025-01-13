import { Text, View } from "react-native";

import { ModalWrapper } from "@/components/ui/modal-wrapper";
import i18n from "@/lib/intl";
import {
  AvailableSorting,
  useSortingStore,
} from "@/features/catalog/store/useSortingStore";
import { Button } from "@/components/ui/button";

const sortFields: {
  label: string;
  value: AvailableSorting;
}[] = [
  {
    label: "По популярности",
    value: "",
  },
  {
    label: "По рейтингу",
    value: "rate_avg",
  },
  {
    label: "По просмотрам",
    value: "views",
  },
  {
    label: "По количеству глав",
    value: "chap_count",
  },
  {
    label: "Дате релиза",
    value: "releaseDate",
  },
  {
    label: "Дате обновление",
    value: "last_chapter_at",
  },
  {
    label: "Дате добавления",
    value: "created_at",
  },
  {
    label: "По названию",
    value: "name",
  },
];

const SortingPicker = () => {
  const { setSortBy, sortBy } = useSortingStore();
  return (
    <ModalWrapper scrollable title={i18n.t("search.sort")}>
      <View style={{ maxWidth: "100%", gap: 4 }}>
        {sortFields.map((field) => (
          <Button
            animationDisabled
            asChild
            onPress={() => setSortBy(field.value)}
            key={field.value}
          >
            <Text
              style={{
                textAlign: "left",
                color:
                  sortBy == field.value
                    ? "rgb(255,255,255)"
                    : "rgb(191,191,191)",
              }}
            >
              {field.label}
            </Text>
          </Button>
        ))}
      </View>
      <View style={{ height: 60 }} />
    </ModalWrapper>
  );
};

export default SortingPicker;
