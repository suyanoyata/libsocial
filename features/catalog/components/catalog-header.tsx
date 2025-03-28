import { Filter, Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";

import { useFilterStore } from "@/features/catalog/store/use-filter-store";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext } from "react";

import { DrawerContext } from "@/features/catalog/context/catalog-drawer-context";
import { router } from "expo-router";

export const CatalogHeader = () => {
  const { top } = useSafeAreaInsets();

  const { setSearch } = useFilterStore();
  const { setOpen } = useContext(DrawerContext);

  return (
    <View
      style={{ paddingTop: top + 8, paddingBottom: 10 }}
      className="bg-zinc-950 px-3.5 flex-row"
    >
      <View className="bg-zinc-900 px-4 py-2 h-10 items-center flex-row font-medium rounded-md flex-1">
        <TextInput
          onChangeText={setSearch}
          placeholder="Search..."
          placeholderTextColor="#52525b"
          className="text-zinc-400 font-medium flex-1 pl-5"
        />
        <Search className="text-zinc-400 absolute left-1.5" size={20} />
      </View>
      <Button
        variant="ghost"
        className="w-[50px] rounded-full ml-2"
        textClassName="text-zinc-400"
        onPress={() => {
          router.push("/catalog-filters-view");
        }}
      >
        <Filter className="text-zinc-400" size={18} />
      </Button>
    </View>
  );
};
