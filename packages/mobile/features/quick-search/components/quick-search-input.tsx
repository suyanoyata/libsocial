import { TextInput, View } from "react-native"

import { useQuickSearchHistory } from "@/features/quick-search/hooks/use-quick-search-history"
import { Icon } from "@/components/icon"
import { Chip as _Chip } from "@/components/ui/chip"
import Animated, { LinearTransition } from "react-native-reanimated"

export const QuickSearchInput = ({
  search,
  setSearch,
}: {
  search: string
  setSearch: (value: string) => void
}) => {
  const { history, addToHistory, deleteFromHistory } = useQuickSearchHistory()

  const Chip = Animated.createAnimatedComponent(_Chip)

  return (
    <View className="px-2">
      <TextInput
        clearButtonMode="always"
        className="bg-muted-darken px-2 py-2.5 mt-2 rounded-md placeholder:text-secondary text-secondary font-medium"
        placeholder="Start searching..."
        value={search}
        onEndEditing={() => addToHistory(search.trim())}
        onChangeText={setSearch}
      />
      <Animated.FlatList
        data={history}
        keyExtractor={(item) => item}
        itemLayoutAnimation={LinearTransition.springify()
          .stiffness(100)
          .damping(15)}
        renderItem={({ item }) => (
          <Chip
            size="sm"
            variant="tonal"
            onPress={() => {
              setSearch(item)
              addToHistory(item)
            }}
            iconRight={
              <Icon
                variant="tonal"
                name="X"
                hitSlop={20}
                onPress={() => deleteFromHistory(item)}
                size={18}
              />
            }
            textClassName="font-semibold"
          >
            {item}
          </Chip>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2 dark:bg-black bg-zinc-100 py-2"
      />
    </View>
  )
}
