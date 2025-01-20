import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { QuickSearchInput } from "@/features/quick-search/components/quick-search-input";

import { Link } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import { InputAccessoryView, ScrollView, Text, View } from "react-native";

export const QuickSearchUI = () => {
  const [search, setSearch] = useState("");

  return (
    <ModalWrapper>
      <QuickSearchInput search={search} setSearch={setSearch} />
      <View className="absolute items-center justify-center flex-1 top-1/2 w-full">
        <Text className="text-white text-sm">oi it looks like its not ready</Text>
        <Link href="../" asChild className="mt-2">
          <Button>Go back</Button>
        </Link>
      </View>
      <InputAccessoryView nativeID="quick-search">
        <ScrollView
          horizontal
          contentContainerClassName="flex-row gap-2 bg-black p-2 flex-1"
        >
          <Button className="bg-zinc-900" iconRight={<X color="white" />}>
            <Text className="text-white">Kaguya sama</Text>
          </Button>
          <Button className="bg-zinc-900">
            <Text className="text-white">Kaguya sama</Text>
          </Button>
        </ScrollView>
      </InputAccessoryView>
    </ModalWrapper>
  );
};
