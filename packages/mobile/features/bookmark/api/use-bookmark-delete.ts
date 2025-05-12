import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/axios"
import { DeviceEventEmitter } from "react-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"
import { toast } from "sonner-native"
import { useState } from "react"
import { withSuccessImpact } from "@/lib/utils"

export const useBookmarkDelete = () => {
  const [toastId, setToastId] = useState<string | number>(0)

  return useMutation({
    mutationKey: ["delete-bookmark"],
    mutationFn: async (data: { slug_url: string; id: number }) => {
      setToastId(toast.loading("Deleting bookmark..."))
      return await api.delete(`/bookmarks?id=${data.id}`)
    },
    onSuccess: (_, props) => {
      withSuccessImpact(() =>
        toast.success("Bookmark deleted", {
          id: toastId,
        })
      )
      DeviceEventEmitter.emit(BookmarkEvents.DELETE_BOOKMARK, props.slug_url)
    },
  })
}
