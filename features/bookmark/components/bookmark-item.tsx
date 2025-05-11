import { useCallback, useEffect, useState } from "react"

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
import { useBookmarkDelete } from "@/features/bookmark/api/use-bookmark-delete"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

export const BookmarkItem = ({ bookmark }: { bookmark: Bookmark }) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useBookmarkUpdate(bookmark.media.slug_url)
  const { mutate: deleteBookmark } = useBookmarkDelete()

  const onStart = useCallback(() => {
    if (bookmark.type == "manga") {
      router.push({
        pathname: "/manga-reader",
        params: {
          slug_url: bookmark.media.slug_url,
          index: bookmark.last_seen ? bookmark.last_seen.item_number - 1 : 0,
        },
      })
    } else {
      router.push({
        pathname: "/anime-watch",
        params: {
          slug_url: bookmark.media.slug_url,
          episodeIndex: bookmark.last_seen?.item_number,
        },
      })
    }
  }, [router, bookmark])

  useEffect(() => {
    if (isPending) {
      setOpen(false)
    }
  }, [isPending])

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

  const { media, last_seen, ...meta } = bookmark

  const mangaStatus = bookmark.last_seen
    ? `Continue from Chapter ${bookmark.last_seen.number}`
    : "Start reading"

  const animeStatus = bookmark.last_seen
    ? `Continue from Episode ${bookmark.last_seen.number}`
    : "Start watching"

  const status = bookmark.type == "manga" ? mangaStatus : animeStatus

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <AnimatedPressable
        entering={FadeIn}
        exiting={FadeOut}
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
            <BookmarkItemActions
              onDelete={() =>
                deleteBookmark({
                  id: bookmark.id,
                  slug_url: bookmark.media.slug_url,
                })
              }
              onEdit={() => setOpen(true)}
            >
              <Button hitSlop={20} asChild size="icon" variant="tonal">
                <Icon name="Ellipsis" size={18} variant="tonal" />
              </Button>
            </BookmarkItemActions>
          </View>
          <Text className="text-primary font-medium text-base mr-12">
            {bookmark.media.eng_name ?? bookmark.media.name}
          </Text>
          <Button
            className="mt-auto"
            size="sm"
            variant="link"
            key={bookmark.id}
            onPress={onStart}
          >
            {status}
          </Button>
        </View>
      </AnimatedPressable>
      <SheetContent>
        <BookmarkSelectBase
          shouldShowDelete={false}
          data={bookmark}
          onSelect={(value) => mutate({ name: value, id: bookmark.id })}
        />
      </SheetContent>
    </Sheet>
  )
}
