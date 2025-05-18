import { DeviceEventEmitter, Platform } from "react-native"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

import { trpc } from "@/lib/trpc"
import { t } from "@/lib/trpc/trpc-client"

// dev
import { useSyncQueriesExternal } from "react-query-external-sync"

interface BookmarkEventsProps {
  children?: React.ReactNode
}

export const BookmarkEventsProvider = ({ children }: BookmarkEventsProps) => {
  const client = useQueryClient()

  useSyncQueriesExternal({
    queryClient: client,
    socketURL: "http://192.168.50.48:42831",
    deviceName: Platform?.OS || "web",
    platform: Platform?.OS || "web",
    deviceId: Platform?.OS || "web",
    enableLogs: false,
  })

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
        const bookmark = client.getQueryData(
          trpc.bookmarks.get.queryKey({
            slug_url: data.slug_url,
            type: "manga",
          })
        )

        if (!bookmark) return

        await t.bookmarks.update.mutate({
          id: bookmark.id,
          chapterIndex: data.lastReadChapter,
        })

        client.invalidateQueries({
          queryKey: trpc.bookmarks.list.queryKey(),
        })

        client.invalidateQueries({
          queryKey: trpc.bookmarks.get.queryKey({ slug_url: data.slug_url }),
        })
      }
    )

    DeviceEventEmitter.addListener(
      BookmarkEvents.UPDATE_WATCH_BOOKMARK,
      async (data) => {
        const bookmark = client.getQueryData(
          trpc.bookmarks.get.queryKey({
            slug_url: data.slug_url,
            type: "anime",
          })
        )

        if (!bookmark) return

        await t.bookmarks.update.mutate({
          id: bookmark.id,
          episodeIndex: data.index,
        })

        client.invalidateQueries({
          queryKey: trpc.bookmarks.list.queryKey(),
        })

        client.invalidateQueries({
          queryKey: trpc.bookmarks.get.queryKey({
            slug_url: data.slug_url,
          }),
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
