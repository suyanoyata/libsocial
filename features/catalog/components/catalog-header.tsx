import { TextInput, View } from "react-native"

import { Button } from "@/components/ui/button"

import { useFilterStore } from "@/features/catalog/store/use-filter-store"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { router } from "expo-router"
import { Icon } from "@/components/icon"

export const CatalogHeader = () => {
  const { top } = useSafeAreaInsets()

  const { setSearch } = useFilterStore()

  return (
    <View
      style={{ paddingTop: top + 4, paddingBottom: 10 }}
      className="bg-accent-darken px-2 flex-row"
    >
      <View className="bg-accent px-4 py-2 h-10 items-center flex-row font-medium rounded-md flex-1">
        <TextInput
          onChangeText={setSearch}
          placeholderTextColor="#a1a1aa"
          placeholder="Search..."
          className="text-muted placeholder:text-muted font-medium flex-1 pl-5"
        />
        <Icon
          name="Search"
          className="text-muted absolute left-1.5"
          size={20}
        />
      </View>
      <Button
        variant="ghost"
        className="rounded-full ml-2 active:bg-white/20"
        onPress={() => {
          router.push("/catalog-filters-view")
        }}
      >
        <Icon
          name="Funnel"
          className="text-muted"
          size={16}
          strokeWidth={2.5}
        />
      </Button>
    </View>
  )
}
