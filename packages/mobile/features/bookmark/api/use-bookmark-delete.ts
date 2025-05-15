import { useMutation } from "@tanstack/react-query"

import { DeviceEventEmitter } from "react-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"
import { toast } from "sonner-native"
import { useState } from "react"
import { withSuccessImpact } from "@/lib/utils"
import { trpc } from "@/lib/trpc"

export const useBookmarkDelete = () => {
  const [toastId, setToastId] = useState<string | number>(0)

  return useMutation(
    trpc.bookmarks.delete.mutationOptions({
      onMutate: () => setToastId(toast.loading("Deleting bookmark...")),
      onSuccess: (_, props) => {
        withSuccessImpact(() =>
          toast.success("Bookmark deleted", {
            id: toastId,
          })
        )
        DeviceEventEmitter.emit(BookmarkEvents.DELETE_BOOKMARK, props.slug_url)
      },
    })
  )
}
