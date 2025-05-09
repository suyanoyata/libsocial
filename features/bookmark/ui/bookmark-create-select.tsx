import { Button } from "@/components/ui/button"
import { View } from "react-native"

import { bookmarkOptions } from "@/features/bookmark/const/bookmark-options"

import { useBookmarkAPI } from "@/features/bookmark/api/use-bookmark-api"

import { useBookmarkCreate } from "@/features/bookmark/api/use-bookmark-create"
import { useBookmarkDelete } from "@/features/bookmark/api/use-bookmark-delete"
import { BookmarkSelectBase } from "@/features/bookmark/components/bookmark-select-base"

interface BookmarkCreateSelectProps {
  slug_url: string
  type: string
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
      onSelect={(name) => {
        createBookmark({
          slug_url,
          name,
          type,
        })
        setOpen(false)
      }}
      onDelete={() => {
        deleteBookmark({
          slug_url,
          type,
        })
        setOpen(false)
      }}
    />
  )
}
