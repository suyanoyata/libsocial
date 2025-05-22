import { Pressable, View } from "react-native"

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
      <Pressable
        onPress={() => {
          router.push("/catalog-filters-view")
        }}
        hitSlop={20}
        className="z-30 p-6 absolute right-3 top-0 size-5 justify-center items-center"
      >
        <Icon name="Funnel" className="text-muted size-5" strokeWidth={2.5} />
      </Pressable>
    </View>
  )
}
