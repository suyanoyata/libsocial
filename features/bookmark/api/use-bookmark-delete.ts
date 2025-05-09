import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/axios"
import { DeviceEventEmitter } from "react-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"
import { toast } from "sonner-native"

export const useBookmarkDelete = () => {
  return useMutation({
    mutationKey: ["delete-bookmark"],
    mutationFn: async (data: { slug_url: string; type: string }) => {
      return await api.delete(
        `/bookmarks?slug_url=${data.slug_url}&type=${data.type}`
      )
    },
    onSuccess: (_, props) => {
      toast.success("Bookmark deleted")
      DeviceEventEmitter.emit(BookmarkEvents.DELETE_BOOKMARK, props.slug_url)
    },
  })
}
