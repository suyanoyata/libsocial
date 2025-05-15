import { useReadingTracker } from "@/store/use-reading-tracker"
import { useBookmarkAPI } from "@/features/bookmark/api/use-bookmark-api"

import { useBookmarkCreate } from "@/features/bookmark/api/use-bookmark-create"
import { useBookmarkDelete } from "@/features/bookmark/api/use-bookmark-delete"

import { BookmarkSelectBase } from "@/features/bookmark/components/bookmark-select-base"

import type { BookmarkName } from "api/lib/prisma/client"

interface BookmarkCreateSelectProps {
  slug_url: string
  type: "manga" | "anime"
  setOpen: (open: boolean) => void
}

export const BookmarkCreateSelectUI = ({
  setOpen,
  slug_url,
  type,
}: BookmarkCreateSelectProps) => {
  const { mutate: createBookmark } = useBookmarkCreate()
  const { mutate: deleteBookmark } = useBookmarkDelete()

  const { data } = useBookmarkAPI({
    slug_url,
    type,
  })

  return (
    <BookmarkSelectBase
      data={data}
      onSelect={async (name: string) => {
        if (type == "manga") {
          const list = useReadingTracker.getState().lastReadItems

          const existingTitle = list.find((item) => item.slug_url == slug_url)

          if (existingTitle) {
            return createBookmark({
              slug_url,
              name: name as BookmarkName,
              type,
              chapterIndex: existingTitle.lastReadChapter,
            })
          }

          return createBookmark({
            slug_url,
            name: name as BookmarkName,
            type,
          })
        }

        setOpen(false)
      }}
      onDelete={() => {
        if (!data) return

        deleteBookmark({
          slug_url,
          id: data.id,
        })

        setOpen(false)
      }}
    />
  )
}
