import { Button } from "@/components/ui/button";
import { FadeView } from "@/components/ui/fade-view";
import { ModalWrapper } from "@/components/ui/modal-wrapper";

import { useQuickSearch } from "@/features/quick-search/api/use-quick-search";

import { QuickSearchFetching } from "@/features/quick-search/components/quick-search-fetching";
import { QuickSearchInput } from "@/features/quick-search/components/quick-search-input";

import useDebounce from "@/hooks/use-debounce";
import { useQuickSearchHistory } from "@/features/quick-search/hooks/use-quick-search-history";

import { useEffect, useState } from "react";
import { InputAccessoryView, Keyboard, ScrollView, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { QuickSearchCard } from "@/features/quick-search/components/quick-search-card";
import { QuickSearchContent } from "@/features/quick-search/components/quick-search-content";

export const QuickSearchUI = () => {
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 650);

  const signal = new AbortController();
  useQuickSearch(query, signal.signal);

  useEffect(() => {
    return () => {
      signal.abort();
    };
  }, [search]);

  const { history } = useQuickSearchHistory();

  return (
    <ModalWrapper>
      <QuickSearchInput search={search} setSearch={setSearch} />
      {!search && (
        <FadeView
          withExit
          className="absolute items-center justify-center flex-1 top-1/2 w-full"
        >
          <Text className="text-white text-sm">Type something in search</Text>
        </FadeView>
      )}
      <QuickSearchFetching q={query} live={search} />
      <QuickSearchContent q={query} live={search} />
      <InputAccessoryView nativeID="quick-search">
        <ScrollView
          keyboardShouldPersistTaps="always"
          horizontal
          contentContainerClassName="flex-row gap-2 bg-black p-2 flex-1"
        >
          {history.map((item, index) => (
            <Button
              size="sm"
              key={index}
              onPress={() => {
                setSearch(item);
                Keyboard.dismiss();
              }}
              className="bg-zinc-900 z-10"
              iconRight={<X size={18} color="white" />}
            >
              <Text className="text-white">{item}</Text>
            </Button>
          ))}
        </ScrollView>
      </InputAccessoryView>
    </ModalWrapper>
  );
};
