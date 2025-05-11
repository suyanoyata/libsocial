import { SafeAreaView, ScrollView, View } from "react-native"

import { Text } from "@/components/ui/text"
import { useDownloads } from "@/features/downloads/store/use-downloads"

import { DownloadCard } from "@/features/downloads/components/download-card"
import { Icon } from "@/components/icon"

export default function Downloads() {
  const { items } = useDownloads()

  if (items.length == 0) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-muted text-center mx-3 leading-7">
          You don't have any downloaded chapters. To download them go to any
          manga chapters and press on{" "}
          <View className="h-4">
            <Icon
              name="Download"
              className="text-secondary"
              size={20}
              strokeWidth={3}
            />
          </View>{" "}
          icon.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="mt-4 mx-2">
      <SafeAreaView className="gap-4">
        {items.map((item, index) => (
          <DownloadCard item={item} key={index} />
        ))}
      </SafeAreaView>
    </ScrollView>
  )
}
