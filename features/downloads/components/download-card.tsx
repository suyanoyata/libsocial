import { Pressable, View } from "react-native"
import { Text } from "@/components/ui/text"

import { TransitionedImage } from "@/features/shared/components/transitioned-image"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { router } from "expo-router"

import {
  DownloadedChapter,
  useDownloads,
} from "@/features/downloads/store/use-downloads"
import { useMemo, useState } from "react"
import { ContentCollectionView } from "@/components/ui/content-collection-view"

import { Icon } from "@/components/icon"

import { withSuccessImpact } from "@/lib/utils"

import { toast } from "sonner-native"

export const DownloadCard = ({ item }: { item: DownloadedChapter }) => {
  const deleteChapter = useDownloads((state) => state.deleteChapter)

  const [reverse, setReverse] = useState(false)

  const _items = useDownloads((state) => state.items)
    .filter((i) => i.title.slug_url == item.title.slug_url)
    .sort((a, b) => a.chapter.item_number - b.chapter.item_number)

  const items = useMemo(
    () => (reverse ? _items?.toReversed() : _items),
    [_items, reverse]
  )

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Pressable
        onPress={() => setOpen(true)}
        className="bg-muted-darken active:opacity-90 overflow-hidden rounded-lg flex-row mx-2"
      >
        <TransitionedImage
          width={120}
          height={160}
          source={{ uri: item.title.cover.default }}
        />
        <View className="p-2 flex-1 relative">
          <Text className="text-primary font-medium text-base">
            {item.title.eng_name ?? item.title.name}
          </Text>
          <Text className="text-muted font-medium text-sm" numberOfLines={4}>
            {item.title.summary}
          </Text>
          <View className="mt-auto">
            <Text className="text-muted text-sm font-medium">
              You have {items.length} chapters downloaded
            </Text>
          </View>
        </View>
      </Pressable>
      <SheetContent className="h-[80vh]">
        <ContentCollectionView
          className="flex-1 mb-24"
          title={`${items.length} chapters`}
          reverseCallback={() => setReverse((prev) => !prev)}
          descending={reverse}
          data={items}
          estimatedItemSize={56}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setOpen(false)
                router.push({
                  pathname: "/downloaded-reader",
                  params: {
                    slug_url: item.title.slug_url,
                    volume: item.chapter.volume,
                    chapter: item.chapter.number,
                  },
                })
              }}
              className="h-11 mt-2 justify-between rounded-lg px-4 dark:bg-zinc-900 bg-zinc-100 items-center flex-row"
            >
              <Text className="text-secondary font-medium">
                Volume {item.chapter.volume} Chapter {item.chapter.number}
              </Text>
              <Icon
                onPress={() => {
                  withSuccessImpact(() =>
                    deleteChapter(
                      item.title.slug_url,
                      item.chapter.volume,
                      item.chapter.number
                    )
                  )

                  toast.success(
                    `Chapter ${item.chapter.number} deleted from ${item.title.name}`
                  )
                }}
                name="Trash2"
                className="text-red-400"
              />
            </Pressable>
          )}
        />
      </SheetContent>
    </Sheet>
  )
}
