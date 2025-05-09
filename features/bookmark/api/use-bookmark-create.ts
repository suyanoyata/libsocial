import { api } from "@/lib/axios"

import { DeviceEventEmitter } from "react-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

import { useMutation } from "@tanstack/react-query"
import { useReadingTracker } from "@/store/use-reading-tracker"
import { toast } from "sonner-native"

export const useBookmarkCreate = () => {
  return useMutation({
    mutationKey: ["create-bookmark"],
    mutationFn: async (data: {
      name: string
      slug_url: string
      type: string
    }) => {
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
      toast.success("Bookmark created")
      DeviceEventEmitter.emit(BookmarkEvents.CREATE_BOOKMARK, props.slug_url)
    },
  })
}
