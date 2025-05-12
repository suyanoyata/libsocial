import { api } from "@/lib/axios"

import { DeviceEventEmitter } from "react-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

import { useMutation } from "@tanstack/react-query"
import { useReadingTracker } from "@/store/use-reading-tracker"
import { toast } from "sonner-native"
import { useState } from "react"
import { withErrorImpact, withSuccessImpact } from "@/lib/utils"

export const useBookmarkCreate = () => {
  const [id, setId] = useState<string | number>(0)

  return useMutation({
    mutationKey: ["create-bookmark"],
    mutationFn: async (data: {
      name: string
      slug_url: string
      type: string
    }) => {
      setId(toast.loading("Creating bookmark..."))
      if (data.type == "manga") {
        const list = useReadingTracker.getState().lastReadItems

        const existingTitle = list.find(
          (item) => item.slug_url == data.slug_url
        )

        if (existingTitle) {
          return await api.post("/bookmarks", {
            ...data,
            chapterIndex: existingTitle.lastReadChapter,
          })
        }
      }

      return await api.post("/bookmarks", data)
    },
    onSuccess: (_, props) => {
      withSuccessImpact(() => toast.success("Bookmark created", { id }))
      DeviceEventEmitter.emit(BookmarkEvents.CREATE_BOOKMARK, props.slug_url)
    },
    onError: (error) => {
      withErrorImpact(() =>
        toast.error("Failed to create bookmark", {
          id,
        })
      )
    },
  })
}
