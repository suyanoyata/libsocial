// TODO: typescript bug on bookmark.media?

import { memo, useCallback, useEffect, useState } from "react"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import FastImage from "@d11/react-native-fast-image"
import { Pressable, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/icon"

import { router } from "expo-router"

import { BookmarkSelectBase } from "@/features/bookmark/components/bookmark-select-base"
import { BookmarkItemActions } from "@/features/bookmark/components/bookmark-item-actions"

import { Sheet, SheetContent } from "@/components/ui/sheet"

import { useBookmarkUpdate } from "@/features/bookmark/api/use-bookmark-update"
import { useBookmarkDelete } from "@/features/bookmark/api/use-bookmark-delete"

import type { BookmarkName } from "api/lib/prisma/client"
import type { BookmarkListItem } from "api/router/bookmarkRouter"

export const BookmarkItem = memo(
  ({ bookmark }: { bookmark: BookmarkListItem }) => {
    const [open, setOpen] = useState(false)

    const { mutate, isPending } = useBookmarkUpdate(bookmark.media?.slug_url)
    const { mutate: deleteBookmark } = useBookmarkDelete()

    const onStart = useCallback(() => {
      if (bookmark.type == "manga") {
        router.push({
          pathname: "/manga-reader",
          params: {
            slug_url: bookmark.media?.slug_url ?? "",
            index: bookmark.last_seen ? bookmark.last_seen.item_number - 1 : 0,
          },
        })
      } else {
        router.push({
          pathname: "/anime-watch",
          params: {
            slug_url: bookmark.media!.slug_url,
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

    const mangaStatus = bookmark.last_seen
      ? `Continue from Chapter ${bookmark.last_seen.number}`
      : "Start reading"

    const animeStatus = bookmark.last_seen
      ? `Continue from Episode ${bookmark.last_seen.number}`
      : "Start watching"

    const status = bookmark.type == "manga" ? mangaStatus : animeStatus

    if (!bookmark.media) return

    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Sheet open={open} onOpenChange={setOpen}>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/title-info",
                params: {
                  slug_url: bookmark.media!.slug_url,
                  site: bookmark.media!.site,
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
                      slug_url: bookmark.media!.slug_url,
                    })
                  }
                  onEdit={() => setOpen(true)}
                >
                  <Button hitSlop={20} asChild size="icon" variant="tonal">
                    <Icon name="Ellipsis" size={18} variant="tonal" />
                  </Button>
                </BookmarkItemActions>
              </View>
              <Text
                className="text-primary font-medium text-base mr-12 line-clamp-2"
                numberOfLines={2}
              >
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
          </Pressable>
          <SheetContent>
            <BookmarkSelectBase
              shouldShowDelete={false}
              data={bookmark}
              onSelect={(value) =>
                mutate({ name: value as BookmarkName, id: bookmark.id })
              }
            />
          </SheetContent>
        </Sheet>
      </Animated.View>
    )
  }
)
