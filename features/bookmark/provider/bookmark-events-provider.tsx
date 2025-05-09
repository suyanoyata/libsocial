import { DeviceEventEmitter } from "react-native"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"
import { api } from "@/lib/axios"

interface BookmarkEventsProps {
  children?: React.ReactNode
}

export const BookmarkEventsProvider = ({ children }: BookmarkEventsProps) => {
  const client = useQueryClient()

  useEffect(() => {
    DeviceEventEmitter.addListener(
      BookmarkEvents.CREATE_BOOKMARK,
      (slug_url: string) => {
        client.invalidateQueries({
          queryKey: ["bookmarks"],
        })

        client.invalidateQueries({
          queryKey: ["bookmark", slug_url],
        })
      }
    )

    DeviceEventEmitter.addListener(
      BookmarkEvents.UPDATE_READ_BOOKMARK,
      async (data) => {
        await api.put("/bookmarks", {
          slug_url: data.slug_url,
          type: "manga",
          chapterIndex: data.lastReadChapter,
        })

        client.invalidateQueries({
          queryKey: ["bookmarks"],
        })
        client.invalidateQueries({
          queryKey: ["bookmark", data.slug_url],
        })
      }
    )

    DeviceEventEmitter.addListener(
      BookmarkEvents.DELETE_BOOKMARK,
      (slug_url: string) => {
        client.invalidateQueries({
          queryKey: ["bookmark", slug_url],
        })
        client.invalidateQueries({
          queryKey: ["bookmarks"],
        })
      }
    )

    return () => {
      DeviceEventEmitter.removeAllListeners(BookmarkEvents.CREATE_BOOKMARK)
      DeviceEventEmitter.removeAllListeners(BookmarkEvents.UPDATE_READ_BOOKMARK)
      DeviceEventEmitter.removeAllListeners(BookmarkEvents.DELETE_BOOKMARK)
    }
  }, [])

  return children
}
