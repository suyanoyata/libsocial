import { DeviceEventEmitter } from "react-native"
import { toast } from "sonner-native"
import { api } from "@/lib/axios"

import { useMutation } from "@tanstack/react-query"

import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"
import { useState } from "react"
import { withErrorImpact, withSuccessImpact } from "@/lib/utils"

export const useBookmarkUpdate = (slug_url: string) => {
  const [toastId, setToastId] = useState<string | number>(0)

  return useMutation({
    mutationKey: ["update-bookmark"],
    mutationFn: async (data: { id: number; name: string }) => {
      setToastId(toast.loading("Updating bookmark..."))

      return await api.put("/bookmarks", data)
    },
    onSuccess: () => {
      DeviceEventEmitter.emit(BookmarkEvents.CREATE_BOOKMARK, slug_url)
      withSuccessImpact(() =>
        toast.success("Bookmark updated", {
          id: toastId,
        })
      )
    },
    onError: () => {
      withErrorImpact(() =>
        toast.error("Couldn't update bookmark", {
          id: toastId,
        })
      )
    },
  })
}
