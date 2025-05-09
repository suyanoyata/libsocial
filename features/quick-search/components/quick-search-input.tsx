import { ScrollView, TextInput, View } from "react-native"

import { Button, textVariants } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import { useQuickSearchHistory } from "@/features/quick-search/hooks/use-quick-search-history"
import { Icon } from "@/components/icon"
import { Chip } from "@/components/ui/chip"

export const QuickSearchInput = ({
  search,
  setSearch,
}: {
  search: string
  setSearch: (value: string) => void
}) => {
  const { history, addToHistory, deleteFromHistory } = useQuickSearchHistory()

  return (
    <View className="px-2">
      <TextInput
        clearButtonMode="always"
        inputAccessoryViewID="quick-search"
        className="bg-muted-darken px-2 py-2.5 mt-2 rounded-md placeholder:text-secondary text-secondary font-medium"
        placeholder="Start searching..."
        value={search}
        onEndEditing={() => addToHistory(search.trim())}
        onChangeText={setSearch}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2 dark:bg-black bg-zinc-100 py-2"
      >
        {history.map((item, index) => (
          <Chip
            size="sm"
            variant="tonal"
            onPress={() => {
              setSearch(item)
              addToHistory(item)
            }}
            key={index}
            iconRight={
              <Icon
                variant="tonal"
                name="X"
                onPress={() => deleteFromHistory(item)}
                size={18}
              />
            }
            textClassName="font-semibold"
          >
            {item}
          </Chip>
        ))}
      </ScrollView>
    </View>
  )
}
