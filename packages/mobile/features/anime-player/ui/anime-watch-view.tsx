import { useRoute } from "@react-navigation/native"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { DeviceEventEmitter, SafeAreaView, View } from "react-native"
import { AnimeEpisodeSwitcher } from "@/features/anime-player/components/anime-episode-switcher"
import { AnimeHeaderInfo } from "@/features/anime-player/components/anime-header-info"
import { AnimePlayer } from "@/features/anime-player/components/anime-player"

import { useAnimeStore } from "@/features/anime-player/context/anime-context"
import { AnimeRouteSchema } from "@/features/anime-player/types/anime-route-params"
import { BookmarkEvents } from "@/features/bookmark/const/bookmark-events"

import { useTitleInfo } from "@/features/title/api/use-title-info"

import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { FullscreenError } from "@/components/ui/fullscreen-error"
import { useWatchTracker } from "@/store/use-watch-tracker"

export const AnimeWatchView = () => {
  const route = useRoute()
  const { selectedEpisodeIndex, setSlugUrl, setEpisodeIndex } = useAnimeStore()

  const { data, error } = useMemo(
    () => AnimeRouteSchema.safeParse(route.params),
    [route.params]
  )

  const { get, add } = useWatchTracker()
  const client = useQueryClient()

  useEffect(() => {
    if (!data) return

    setEpisodeIndex(Number(data.episodeIndex) ?? 0)
    setSlugUrl(data.slug_url)
  }, [data])

  useEffect(() => {
    if (data) {
      const localTitle = get(data.slug_url)

      if (localTitle && localTitle?.lastWatchedEpisode - 1 < selectedEpisodeIndex) {
        DeviceEventEmitter.emit(BookmarkEvents.UPDATE_WATCH_BOOKMARK, {
          slug_url: data.slug_url,
          index: selectedEpisodeIndex
        })
      }

      add(client, data?.slug_url, selectedEpisodeIndex)
    }
  }, [data, selectedEpisodeIndex])

  const { data: titleInfo } = useTitleInfo(data!.slug_url, "5")

  if (error) {
    return <FullscreenError>Something went wrong</FullscreenError>
  }

  if (!titleInfo) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <SafeAreaView>
      <AnimeHeaderInfo />
      <AnimePlayer />
      <AnimeEpisodeSwitcher />
    </SafeAreaView>
  )
}
