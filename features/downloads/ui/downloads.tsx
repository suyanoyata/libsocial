import { FlatList, SafeAreaView, ScrollView, View } from "react-native"

import { Text } from "@/components/ui/text"
import {
  DownloadedChapter,
  useDownloads,
} from "@/features/downloads/store/use-downloads"

import { DownloadCard } from "@/features/downloads/components/download-card"
import { Icon } from "@/components/icon"
import { useMemo } from "react"

export default function Downloads() {
  const { items } = useDownloads()

  const list = useMemo(() => {
    const map = new Map<string, DownloadedChapter>(
      items.map((item) => [item.title.slug_url, item])
    )

    return new Array(...map.values())
  }, [items])

  const renderItem = ({ item }: { item: DownloadedChapter }) => (
    <DownloadCard item={item} />
  )

  const keyExtractor = (item: DownloadedChapter) => item.title.slug_url

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
    <SafeAreaView className="gap-4 my-4 flex-1">
      <FlatList
        contentContainerClassName="gap-3"
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}
