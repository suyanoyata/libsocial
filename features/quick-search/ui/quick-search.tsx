import { FadeView } from "@/components/ui/fade-view";

import { useQuickSearch } from "@/features/quick-search/api/use-quick-search";

import { QuickSearchFetching } from "@/features/quick-search/components/quick-search-fetching";
import { QuickSearchInput } from "@/features/quick-search/components/quick-search-input";

import useDebounce from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";

import { View } from "react-native";
import { Search, X } from "lucide-react-native";

import { QuickSearchContent } from "@/features/quick-search/components/quick-search-content";
import withBubble from "@/components/ui/withBubble";

export const QuickSearchUI = () => {
  const [search, setSearch] = useState("");
  const [query] = useDebounce(search, 650);

  const signal = new AbortController();
  const { data, isError, isFetching } = useQuickSearch(query, signal.signal);

  useEffect(() => {
    return () => {
      signal.abort();
    };
  }, [search]);

  const SearchIcon = withBubble(Search);

  return (
    <View className="px-2 flex-1">
      <QuickSearchInput search={search} setSearch={setSearch} />
      {!search && (
        <FadeView withExit className="absolute items-center justify-center flex-1 top-1/2 w-full">
          <SearchIcon />
          <Text className="text-secondary text-sm mt-2">Type something in search</Text>
        </FadeView>
      )}
      <QuickSearchFetching q={query} live={search} />
      <QuickSearchContent q={query} live={search} />
      {search == query && search.length > 0 && data?.length == 0 && !isError && !isFetching && (
        <FadeView
          withEnter
          className="absolute items-center justify-center flex-1 top-[45%] w-full"
        >
          <SearchIcon />
          <Text className="text-muted mt-2">
            No results found for <Text className="text-secondary">"{search.trim()}"</Text>
          </Text>
        </FadeView>
      )}
    </View>
  );
};
