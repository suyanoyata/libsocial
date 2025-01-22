import { ScrollView, TextInput, View, Text } from "react-native";

import { X } from "lucide-react-native";

import { Button } from "@/components/ui/button";

import { useQuickSearchHistory } from "@/features/quick-search/hooks/use-quick-search-history";

export const QuickSearchInput = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  const { history, addToHistory, deleteFromHistory } = useQuickSearchHistory();

  return (
    <View className="px-2">
      <TextInput
        clearButtonMode="always"
        inputAccessoryViewID="quick-search"
        placeholderTextColor="#52525b"
        className="bg-zinc-900 px-2 py-2.5 mt-2 rounded-md text-zinc-200 font-medium"
        placeholder="Start searching..."
        value={search}
        onEndEditing={() => addToHistory(search)}
        onChangeText={(value) => setSearch(value)}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2 bg-black py-2"
      >
        {history.map((item, index) => (
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              setSearch(item);
              addToHistory(item);
            }}
            key={index}
            className="bg-zinc-900 active:bg-zinc-800"
            iconRight={
              <X onPress={() => deleteFromHistory(item)} color="white" size={18} />
            }
          >
            <Text className="text-white">{item}</Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
};
