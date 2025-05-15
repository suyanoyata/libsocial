import { DeviceEventEmitter } from "react-native"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner-native"
import { useState } from "react"
import { withErrorImpact, withSuccessImpact } from "@/lib/utils"

import { trpc } from "@/lib/trpc"

import { useBottomSheet } from "@gorhom/bottom-sheet"

export const useBookmarkCreate = () => {
  const [id, setId] = useState<string | number>(0)

  const { close } = useBottomSheet()

  return useMutation(
    trpc.bookmarks.create.mutationOptions({
      onMutate: () => {
        close()
        setId(toast.loading("Creating bookmark..."))
      },
      onSuccess: (_, props) => {
        withSuccessImpact(() => toast.success("Bookmark created", { id }))
        DeviceEventEmitter.emit(BookmarkEvents.CREATE_BOOKMARK, props.slug_url)
      },
      onError: () => {
        withErrorImpact(() =>
          toast.error("Failed to create bookmark", {
            id,
          })
        )
      },
    })
  )
}
