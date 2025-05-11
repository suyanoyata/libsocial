import { DeviceEventEmitter, Pressable } from "react-native"

import { Text } from "@/components/ui/text"

import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from "react"
import { router, useFocusEffect } from "expo-router"

import { useQueryClient } from "@tanstack/react-query"
import { useWatchTracker } from "@/store/use-watch-tracker"

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response"

import { withImpact } from "@/lib/utils"
import { actionToast } from "@/features/title/lib/action-toast"
import Animated, { BounceIn } from "react-native-reanimated"
import { Icon } from "@/components/icon"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

export const Episode = memo(
  ({
    slug_url,
    index,
    episode,
  }: {
    slug_url: string
    index: number
    episode: TitleEpisodeBase
  }) => {
    const queryClient = useQueryClient()

    const { add, isEpisodeExists, removeEpisode, get } = useWatchTracker()

    const [watch, setWatch] = useState(isEpisodeExists(slug_url, index))
    const WatchIcon = !watch ? "EyeOff" : "Eye"

    const [isPending, startTransition] = useTransition()

    const title = get(slug_url)

    const isLastWatchedEpisode = useMemo(() => {
      return get(slug_url)?.lastWatchedEpisode == index
    }, [title])

    const watchCallback = useCallback(
      () => setWatch(isEpisodeExists(slug_url, index)),
      [index]
    )

    useFocusEffect(watchCallback)
    useLayoutEffect(watchCallback, [index])

    const addCallback = useCallback(() => {
      add(queryClient, slug_url, index)
    }, [slug_url, index])

    return (
      <Pressable
        onPress={() => {
          if (isPending) return

          const episode = get(slug_url)

          if (episode && episode.lastWatchedEpisode < index) {
            DeviceEventEmitter.emit(BookmarkEvents.UPDATE_WATCH_BOOKMARK, {
              slug_url,
              type: "anime",
              index,
            })
          }

          router.back()

          setWatch(true)

          withImpact(() =>
            startTransition(() => {
              addCallback()
              router.navigate({
                pathname: "/anime-watch",
                params: {
                  slug_url,
                  episodeIndex: index,
                },
              })
            })
          )
        }}
        className="content-list-view-item"
      >
        <Pressable
          hitSlop={10}
          onPress={() => {
            if (watch) {
              setWatch(false)
              removeEpisode(slug_url, index)
            } else {
              setWatch(true)
              addCallback()
            }

            actionToast(
              "watch",
              get(slug_url)!?.lastWatchedEpisode - 1 <= index,
              `Marked Episode ${episode.number} as ${
                watch ? "unwatched" : "watched"
              }`,
              watch
            )
          }}
        >
          {isLastWatchedEpisode ? (
            <Animated.View entering={BounceIn.duration(500)}>
              <Icon
                name="Bookmark"
                size={20}
                className="text-red-500 fill-red-500"
              />
            </Animated.View>
          ) : (
            <Icon
              name={WatchIcon}
              strokeWidth={2.8}
              className="text-zinc-500"
              size={20}
            />
          )}
        </Pressable>
        <Text className="text-secondary font-medium">
          Episode {episode.number}
        </Text>
      </Pressable>
    )
  }
)
