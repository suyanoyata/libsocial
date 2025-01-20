import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <Pressable
        style={{ paddingTop: top + 8, paddingBottom: 16 }}
        className="bg-zinc-950"
        onPress={() => router.push("/quick-search")}
      >
        <View className="flex-row items-center bg-zinc-900 mx-2 p-1.5 py-2 rounded-md gap-1.5">
          <Search color="#a1a1aa" size={20} />
          <Text className="text-zinc-400 text-base font-medium">Quick search</Text>
        </View>
      </Pressable>
      <ScrollView className="flex-1 pt-2">{children}</ScrollView>
    </View>
  );
};
