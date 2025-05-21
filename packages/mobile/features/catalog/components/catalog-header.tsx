import { View } from "react-native"

import { useFilterStore } from "@/features/catalog/store/use-filter-store"

import { router } from "expo-router"
import { Icon } from "@/components/icon"
import { TextInput } from "@/components/ui/text-input"

export const CatalogHeader = () => {
  const { setSearch } = useFilterStore()

  return (
    <View className="relative h-12 m-2 mb-3 mt-safe-offset-2">
      <TextInput
        showClearButton={false}
        className="absolute w-full top-0 left-0 pr-8"
        onChangeText={setSearch}
        placeholder="Search..."
      />
      <Icon
        onPress={() => {
          router.push("/catalog-filters-view")
        }}
        name="Funnel"
        className="text-muted absolute right-6 top-3.5 size-5"
        strokeWidth={2.5}
      />
    </View>
  )
}
