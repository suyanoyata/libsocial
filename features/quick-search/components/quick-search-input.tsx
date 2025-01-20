import { ScrollView, TextInput, View, Text } from "react-native";

import { X } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";

export const QuickSearchInput = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  return (
    <View className="mx-2">
      <TextInput
        inputAccessoryViewID="quick-search"
        className="bg-zinc-900 px-2 py-2.5 mt-2 rounded-md text-zinc-200 font-medium"
        placeholder="Search"
        value={search}
        onChangeText={(value) => setSearch(value)}
      />
      <ScrollView
        horizontal
        contentContainerClassName="flex-row gap-2 bg-black py-2 flex-1"
      >
        <Button
          className="bg-zinc-900 active:bg-zinc-800"
          iconRight={<X color="white" />}
        >
          <Text className="text-white">Kaguya sama</Text>
        </Button>
      </ScrollView>
    </View>
  );
};
