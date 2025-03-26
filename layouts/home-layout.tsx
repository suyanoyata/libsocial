import { useHomeTitles } from "@/features/home/api/use-home-titles";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { Pressable, RefreshControl, ScrollView, TextInput, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  const { top } = useSafeAreaInsets();
  const { isRefetching, refetch } = useHomeTitles();

  return (
    <View className="flex-1">
      <View style={{ paddingTop: top + 8, paddingBottom: 16 }} className="bg-zinc-950 relative">
        <View className="bg-zinc-900 px-4 py-2 h-10 items-center flex-row font-medium rounded-md mx-2 z-10">
          <TextInput
            editable={false}
            placeholder="Search..."
            placeholderTextColor="#52525b"
            className="text-zinc-400 font-medium flex-1 pl-5"
          />
          <Search className="text-zinc-400 absolute left-1.5" size={20} />
        </View>
        <Pressable
          className="flex-1 absolute top-0 left-0 h-14 w-full z-30"
          style={{ height: 64 + top }}
          onPress={() => router.push("/quick-search")}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl tintColor="white" onRefresh={refetch} refreshing={isRefetching} />
        }
        className="flex-1 pt-2"
      >
        {children}
      </ScrollView>
    </View>
  );
};
