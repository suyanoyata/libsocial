import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { Pressable, ScrollView, TextInput, View } from "react-native";

import { Text } from "@/components/ui/text";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <Pressable
        style={{ paddingTop: top + 8, paddingBottom: 16 }}
        className="bg-zinc-950"
      >
        <View className="bg-zinc-900 px-4 py-2 h-10 items-center flex-row font-medium rounded-md mx-2">
          <TextInput
            onPress={() => router.push("/quick-search")}
            editable={false}
            placeholder="Search..."
            placeholderTextColor="#52525b"
            className="text-zinc-400 font-medium flex-1 pl-5"
          />
          <Search className="text-zinc-400 absolute left-1.5" size={20} />
        </View>
      </Pressable>
      <ScrollView className="flex-1 pt-2">{children}</ScrollView>
    </View>
  );
};
