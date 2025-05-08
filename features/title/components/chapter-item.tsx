import { Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import Animated, { BounceIn } from "react-native-reanimated"

import { DownloadChapterButton } from "@/features/downloads/components/download-chapter-button"

import { router, useFocusEffect } from "expo-router"
import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from "react"

import { biggest, withImpact } from "@/lib/utils"
import { actionToast } from "@/features/title/lib/action-toast"

import { useTitleReadChapter } from "@/store/use-chapters-tracker"
import { useReadingTracker } from "@/store/use-reading-tracker"
import { useQueryClient } from "@tanstack/react-query"

import { Title } from "@/features/shared/types/title"
import { Chapter as ChapterType } from "@/features/shared/types/chapter"
import { Icon } from "@/components/icon"

export const Chapter = memo(
  ({
    slug_url,
    index,
    chapter,
  }: {
    slug_url: string
    index: number
    chapter: ChapterType
  }) => {
    const get = useTitleReadChapter((state) => state.get)
    const add = useTitleReadChapter((state) => state.add)
    const remove = useTitleReadChapter((state) => state.remove)
    const getReadChapters = useTitleReadChapter(
      (state) => state.getReadChapters
    )

    const client = useQueryClient()

    const {
      get: getLastReadChapter,
      updateLastReadChapter,
      addItem,
    } = useReadingTracker()

    const lastRead = getLastReadChapter(slug_url)

    const [read, setRead] = useState(get(slug_url, index))

    const [isPending, startTransition] = useTransition()

    const readCallback = useCallback(() => {
      setRead(get(slug_url, index))
    }, [index])

    const isCurrentLastReadChapter =
      lastRead && lastRead.lastReadChapter - 1 == index

    useFocusEffect(readCallback)
    useLayoutEffect(readCallback, [index])

    const changeCallback = useCallback(() => {
      if (!read) {
        if (!getLastReadChapter(slug_url)) {
          const data = client.getQueryData<Title>(["title-info", slug_url, "1"])
          const chapters = client.getQueryData<ChapterType[]>([
            "chapters",
            slug_url,
          ])

          if (!data || !chapters) return

          addItem({
            slug_url,
            title: data.eng_name ?? data.name,
            lastReadChapter: index,
            overallChapters: chapters.length,
            site: 1,
            scrollTo: 0,
            cover: data.cover,
          })
        }
        add(slug_url, index)
      } else {
        remove(slug_url, index)
      }
      updateLastReadChapter(slug_url, biggest(getReadChapters(slug_url)!))

      actionToast(
        "read",
        lastRead!?.lastReadChapter <= index,
        `Marked Volume ${chapter.volume} Chapter ${chapter.number} as ${
          read ? "unread" : "read"
        }`,
        read
      )
    }, [read])

    const ReadIcon = useMemo(() => (read ? "Eye" : "EyeOff"), [read])

    return (
      <Pressable
        onPress={() => {
          if (isPending) return
          router.back()
          setRead(true)

          startTransition(() => {
            withImpact(() =>
              router.navigate({
                pathname: "/manga-reader",
                params: {
                  slug_url,
                  index,
                },
              })
            )
          })
        }}
        className="content-list-view-item relative overflow-hidden"
      >
        <Pressable
          hitSlop={10}
          onPress={() => {
            setRead((prev) => !prev)

            startTransition(() => changeCallback())
          }}
        >
          {isCurrentLastReadChapter ? (
            <Animated.View entering={BounceIn.duration(500)}>
              <Icon
                name="Bookmark"
                size={20}
                className="text-red-500 fill-red-500"
              />
            </Animated.View>
          ) : (
            <Icon
              name={ReadIcon}
              strokeWidth={2.8}
              className="text-zinc-500"
              size={20}
            />
          )}
        </Pressable>
        <Text className="text-secondary font-medium">
          Volume {chapter.volume} Chapter {chapter.number}
        </Text>
        <DownloadChapterButton slug_url={slug_url} chapter={chapter} />
      </Pressable>
    )
  }
)
