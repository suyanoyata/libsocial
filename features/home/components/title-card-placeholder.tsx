import { View } from "react-native";

export const TitleCardPlaceholder = () => {
  return (
    <View>
      <View
        style={{ height: 177, width: 120, borderRadius: 4 }}
        className="bg-zinc-900 h-[180px] mb-2 rounded-md"
      />
      <View className="bg-zinc-900 h-4 w-[120px] rounded-md" />
      <View className="bg-zinc-900 h-4 mt-2 w-[80px] rounded-md" />
    </View>
  );
};
