import { DeviceEventEmitter } from "react-native"
import { toast } from "sonner-native"
import { api } from "@/lib/axios"

import { useMutation } from "@tanstack/react-query"

import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

export const useBookmarkUpdate = () => {
  return useMutation({
    mutationKey: ["update-bookmark"],
    mutationFn: async (data: { slug_url: string; name: string }) => {
      return await api.put("/bookmarks", {
        ...data,
        type: "manga",
      })
    },
    onSuccess: (_, props) => {
      DeviceEventEmitter.emit(BookmarkEvents.CREATE_BOOKMARK, props.slug_url)
      toast.success("Bookmark updated")
    },
  })
}
