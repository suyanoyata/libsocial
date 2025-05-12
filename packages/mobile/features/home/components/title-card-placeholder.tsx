import { View } from "react-native"

export const TitleCardPlaceholder = () => {
  return (
    <View>
      <View
        style={{ height: 177, width: 120, borderRadius: 4 }}
        className="bg-muted h-[180px] mb-2 rounded-md"
      />
      <View className="bg-muted h-4 w-[115px] rounded-md" />
      <View className="bg-muted bg-zinc-400/50 h-4 mt-2 w-[80px] rounded-md" />
    </View>
  )
}
