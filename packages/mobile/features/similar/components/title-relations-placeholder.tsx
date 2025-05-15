import { View } from "react-native"

export const TitleRelationsPlaceholder = () => {
  return (
    <View className="w-[350px] h-[150px] bg-muted-darken rounded-lg flex-row overflow-hidden">
      <View className="h-[150px] w-[110px] bg-muted" />
      <View className="flex-1 ml-2 my-2.5">
        <View className="h-[12px] w-[100px] rounded-md bg-muted mt-0.5" />
        <View className="bg-muted h-[18px] w-[150px] mt-1.5 rounded-md" />
        <View className="bg-muted h-[12px] w-[120px] rounded-md mt-auto" />
      </View>
    </View>
  )
}
