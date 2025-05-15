import { DeviceEventEmitter } from "react-native"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"
import { Bookmark } from "@/features/bookmark/types/bookmark"

import { trpc } from "@/lib/trpc"
import { t } from "@/lib/trpc/trpc-client"

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
          queryKey: trpc.bookmarks.list.queryKey(),
        })

        client.invalidateQueries({
          queryKey: trpc.bookmarks.get.queryKey({ slug_url }),
        })
      }
    )

    DeviceEventEmitter.addListener(
      BookmarkEvents.UPDATE_READ_BOOKMARK,
      async (data) => {
        const bookmark = client.getQueryData<Bookmark>([
          "bookmark",
          data.slug_url,
        ])

        if (!bookmark) return

        t.bookmarks.update.mutate({
          id: bookmark.id,
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
      BookmarkEvents.UPDATE_WATCH_BOOKMARK,
      async (data) => {
        const bookmark = client.getQueryData<Bookmark>([
          "bookmark",
          data.slug_url,
        ])

        if (!bookmark) return

        t.bookmarks.update.mutate({ id: bookmark.id, episodeIndex: data.index })

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
          queryKey: trpc.bookmarks.list.queryKey(),
        })

        client.removeQueries({
          queryKey: trpc.bookmarks.get.queryKey({ slug_url }),
        })
      }
    )

    return () => {
      DeviceEventEmitter.removeAllListeners(BookmarkEvents.CREATE_BOOKMARK)
      DeviceEventEmitter.removeAllListeners(BookmarkEvents.UPDATE_READ_BOOKMARK)
      DeviceEventEmitter.removeAllListeners(
        BookmarkEvents.UPDATE_WATCH_BOOKMARK
      )
      DeviceEventEmitter.removeAllListeners(BookmarkEvents.DELETE_BOOKMARK)
    }
  }, [])

  return children
}
