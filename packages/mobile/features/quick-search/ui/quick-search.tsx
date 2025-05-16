import { FadeView } from "@/components/ui/fade-view"

import { useQuickSearch } from "@/features/quick-search/api/use-quick-search"

import { QuickSearchFetching } from "@/features/quick-search/components/quick-search-fetching"
import { QuickSearchInput } from "@/features/quick-search/components/quick-search-input"

import useDebounce from "@/hooks/use-debounce"
import { useState } from "react"

import { Text } from "@/components/ui/text"

import { View } from "react-native"
import { Search } from "lucide-react-native"

import { QuickSearchContent } from "@/features/quick-search/components/quick-search-content"

import withBubble from "@/components/ui/withBubble"

import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated"

export const QuickSearchUI = () => {
  const [_search, setSearch] = useState("")
  const [search] = useDebounce(_search, 650)

  const { data, isError, isFetching } = useQuickSearch(search)

  const SearchIcon = withBubble(Search)

  const keyboard = useAnimatedKeyboard()

  const kbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 3 }],
  }))

  return (
    <View className="px-2 flex-1">
      <QuickSearchInput search={_search} setSearch={setSearch} />
      {!_search && (
        <FadeView
          withExit
          className="absolute items-center justify-center flex-1 top-[45%] w-full"
          style={[kbStyle]}
        >
          <SearchIcon />
          <Text className="text-secondary text-sm mt-2">
            Type something in search
          </Text>
        </FadeView>
      )}
      <QuickSearchFetching q={search} live={_search} />
      <QuickSearchContent q={search} live={_search} />
      {_search == search &&
        _search.length > 0 &&
        data?.data.length == 0 &&
        !isError &&
        !isFetching && (
          <FadeView
            withEnter
            className="absolute items-center justify-center flex-1 top-[45%] w-full"
            style={[kbStyle]}
          >
            <SearchIcon />
            <Text className="text-muted mt-2">
              No results found for{" "}
              <Text className="text-secondary">"{_search.trim()}"</Text>
            </Text>
          </FadeView>
        )}
    </View>
  )
}
