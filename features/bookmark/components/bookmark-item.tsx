import { Text } from "@/components/ui/text"

import { router } from "expo-router"
import { Button } from "@/components/ui/button"

import { Bookmark } from "@/features/bookmark/types/bookmark"

export const BookmarkItem = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <Button
      variant="tonal"
      key={bookmark.id}
      onPress={() => {
        if (bookmark.last_seen) {
          router.push({
            pathname: "/manga-reader",
            params: {
              slug_url: bookmark.media.slug_url,
              index: bookmark.last_seen.item_number - 1,
            },
          })
        }
      }}
    >
      <Text>
        Volume {bookmark.last_seen?.volume} Chapter {bookmark.last_seen?.number}
      </Text>
    </Button>
  )
}
