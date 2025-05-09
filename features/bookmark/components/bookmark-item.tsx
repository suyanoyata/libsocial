import { useCallback, useState } from "react"

import FastImage from "@d11/react-native-fast-image"
import { Pressable, ScrollView, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/icon"

import { router } from "expo-router"

import { BookmarkSelectBase } from "@/features/bookmark/components/bookmark-select-base"
import { BookmarkItemActions } from "@/features/bookmark/components/bookmark-item-actions"

import { Sheet, SheetContent } from "@/components/ui/sheet"

import { Bookmark } from "@/features/bookmark/types/bookmark"
import { useBookmarkUpdate } from "@/features/bookmark/api/use-bookmark-update"

export const BookmarkItem = ({ bookmark }: { bookmark: Bookmark }) => {
  const [open, setOpen] = useState(false)

  const { mutate } = useBookmarkUpdate()

  const onStartReadingCallback = useCallback(() => {
    router.push({
      pathname: "/manga-reader",
      params: {
        slug_url: bookmark.media.slug_url,
        index: bookmark.last_seen ? bookmark.last_seen.item_number - 1 : 0,
      },
    })
  }, [router, bookmark])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/title-info",
            params: {
              slug_url: bookmark.media.slug_url,
              site: bookmark.media.site,
            },
          })
        }}
        className="mb-2 mx-2 bg-muted-darken active:opacity-90 overflow-hidden rounded-lg flex-row"
      >
        <FastImage
          source={{ uri: bookmark.media.cover.default }}
          style={{ width: 120, height: 160 }}
        />
        <View className="p-3 flex-1 relative flex-col">
          <View className="absolute right-2 top-2">
            <BookmarkItemActions onEdit={() => setOpen(true)}>
              <Button hitSlop={20} asChild size="icon" variant="tonal">
                <Icon name="Ellipsis" size={18} variant="tonal" />
              </Button>
            </BookmarkItemActions>
          </View>
          <Text className="text-primary font-medium text-base mr-12">
            {bookmark.media.eng_name ?? bookmark.media.name}
          </Text>
          <Button
            className="w-auto mt-auto"
            size="sm"
            variant="tonal"
            key={bookmark.id}
            onPress={onStartReadingCallback}
          >
            {bookmark.last_seen
              ? `Continue from Chapter ${bookmark.last_seen.number}`
              : "Start reading"}
          </Button>
        </View>
      </Pressable>
      <SheetContent className="h-auto max-h-[80vh]">
        <BookmarkSelectBase
          onSelect={(value) =>
            mutate({ slug_url: bookmark.media.slug_url, name: value })
          }
        />
      </SheetContent>
    </Sheet>
  )
}
