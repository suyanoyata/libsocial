import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

import { DeviceEventEmitter } from "react-native"

import { toast } from "sonner-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

import { trpc } from "@/lib/trpc"

import { withErrorImpact, withSuccessImpact } from "@/lib/utils"

export const useBookmarkUpdate = (slug_url?: string) => {
  const [toastId, setToastId] = useState<string | number>(0)

  return useMutation(
    trpc.bookmarks.update.mutationOptions({
      onMutate: () => setToastId(toast.loading("Updating bookmark...")),
      onSuccess: () => {
        DeviceEventEmitter.emit(BookmarkEvents.CREATE_BOOKMARK, slug_url)
        withSuccessImpact(() =>
          toast.success("Bookmark updated", {
            id: toastId
          })
        )
      },
      onError: () => {
        withErrorImpact(() =>
          toast.error("Couldn't update bookmark", {
            id: toastId
          })
        )
      }
    })
  )
}
