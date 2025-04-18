import { ScrollView, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { X } from "lucide-react-native";

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
        className="bg-muted-darken px-2 py-2.5 mt-2 rounded-md placeholder:text-secondary text-secondary font-medium"
        placeholder="Start searching..."
        value={search}
        onEndEditing={() => addToHistory(search)}
        onChangeText={(value) => setSearch(value)}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2 dark:bg-black bg-zinc-100 py-2"
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
            className="bg-muted-darken active:opacity-80"
            iconRight={
              <X onPress={() => deleteFromHistory(item)} className="text-secondary" size={18} />
            }
          >
            <Text className="text-secondary">{item}</Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
};
