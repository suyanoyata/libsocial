import { FlatList, SafeAreaView, ScrollView, View } from "react-native"

import { Text } from "@/components/ui/text"
import {
  DownloadedChapter,
  useDownloads,
} from "@/features/downloads/store/use-downloads"

import { DownloadCard } from "@/features/downloads/components/download-card"
import { Icon } from "@/components/icon"
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
      <View className="items-center justify-center flex-1 px-8 gap-2 absolute top-0 left-0 h-screen">
        <Lottie
          source={require("@/assets/lottie/duck.json")}
          className="size-28"
        />
        <Text className="text-secondary text-center text-xl font-semibold">
          You don't have any downloaded chapters
        </Text>
        <Text className="text-muted text-center text-base font-medium leading-7">
          To download them go to any manga chapters and press on{" "}
          <View className="h-4">
            <Icon name="Download" variant="tonal" size={20} strokeWidth={3} />
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
