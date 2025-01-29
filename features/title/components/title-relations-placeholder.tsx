import { View } from "react-native";

export const TitleRelationsPlaceholder = () => {
  return (
    <View className="w-[350px] h-[150px] bg-zinc-800 rounded-lg flex-row overflow-hidden">
      <View className="h-[150px] w-[110px] bg-zinc-600" />
      <View className="flex-1 ml-2 my-2.5">
        <View className="h-[12px] w-[100px] rounded-md bg-zinc-600 mt-0.5" />
        <View className="bg-zinc-600 h-[18px] w-[150px] mt-1.5 rounded-md" />
        <View className="bg-zinc-600 h-[12px] w-[120px] rounded-md mt-auto" />
      </View>
    </View>
  );
};
