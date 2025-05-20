import { FlatList, SafeAreaView, ScrollView, View } from "react-native"

import { Text } from "@/components/ui/text"
import {
  DownloadedChapter,
  useDownloads,
} from "@/features/downloads/store/use-downloads"

import { DownloadCard } from "@/features/downloads/components/download-card"
import { useMemo } from "react"
import { Lottie } from "@/components/ui/lottie"

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
      <View className="items-center justify-center w-full px-8 gap-4 absolute top-0 left-0 h-screen">
        <Lottie
          source={require("@/assets/lottie/duck.json")}
          className="size-32"
        />
        <Text className="text-secondary text-center text-lg font-semibold w-full">
          You don't have any downloaded chapters
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
