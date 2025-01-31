import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import { useAgeRestrictions } from "@/features/shared/api/use-filter-constants";

import { CheckIcon } from "lucide-react-native";

import { FlatList, Pressable, View } from "react-native";
import { Checkbox } from "tamagui";

import { Text } from "@/components/ui/text";
import { useMemo } from "react";
import { useProperties } from "@/store/use-properties";

export const CatalogAgeRestrictions = () => {
  const { data } = useAgeRestrictions();

  const { siteId } = useProperties();

  const { handleAgeRestrictionPress, caution } = useFilterStore();

  const filteredRestrictions = useMemo(
    () => data?.filter((item) => item.site_ids.toString().includes(siteId)),
    [data]
  );

  return (
    <View>
      <Text className="text-zinc-200 mb-2 font-medium text-base">Age Restriction</Text>
      <View className="flex-row gap-4 flex-wrap">
        <FlatList
          data={filteredRestrictions}
          showsHorizontalScrollIndicator={false}
          numColumns={2}
          contentContainerClassName="justify-between gap-3"
          renderItem={({ item }) => (
            <Pressable
              key={item.id}
              hitSlop={5}
              onPress={() => handleAgeRestrictionPress(item.id)}
              className="flex-row gap-2 flex-1"
            >
              <Checkbox checked={caution.includes(item.id)}>
                <Checkbox.Indicator>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox>
              <Text className="text-zinc-200">{item.label}</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};
