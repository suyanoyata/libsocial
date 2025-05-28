import FastImage from "@d11/react-native-fast-image"
import { router } from "expo-router"

import { useEffect, useMemo } from "react"
import { View, Pressable } from "react-native"

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated"
import { Icon } from "@/components/icon"
import { Text } from "@/components/ui/text"

import { LastWatchItem, useWatchTracker } from "@/store/use-watch-tracker"

export const LastWatchedTitleCard = ({ item }: { item: LastWatchItem }) => {
  const { hide } = useWatchTracker()

  const allEpisodesWatched = useMemo(
    () => item.lastWatchedEpisode === item.overallEpisodes,
    [item]
  )

  const progress = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, 100])}%`
  }))

  useEffect(() => {
    const id = setTimeout(() => {
      progress.value = withSpring(item.lastWatchedEpisode / item.overallEpisodes, {
        mass: 3,
        damping: 100,
        stiffness: 180
      })
    }, 200)

    return () => {
      clearTimeout(id)
    }
  }, [item])

  if (item.hide == true) return

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/title-info",
          params: {
            slug_url: item.slug_url,
            site: "5",
            withDelay: allEpisodesWatched ? undefined : "1"
          }
        })
        // if (!allEpisodesWatched) {
        //   router.push({
        //     pathname: "/manga-reader",
        //     params: {
        //       slug_url: item.slug_url,
        //       index: String(item.lastWatchedEpisode - 1),
        //     },
        //   });
        // }
      }}
      className="recent-viewed-card-bg"
    >
      <Pressable
        onPress={() => {
          hide(item.slug_url)
        }}
        hitSlop={8}
        className="absolute top-2 right-2 text-zinc-500 z-10"
      >
        <Icon name="X" className="text-zinc-400" strokeWidth={2.2} size={20} />
      </Pressable>
      <FastImage
        source={{ uri: item.cover.thumbnail }}
        style={{ width: 100, height: 140 }}
      />
      <View className="p-2 flex-1">
        <Text className="recent-viewed-card" numberOfLines={2}>
          {item.title}
        </Text>
        {!allEpisodesWatched ? (
          <View className="recent-viewed-card-progress-bg">
            <Animated.View
              className="recent-viewed-card-progress-bg-active"
              style={[animatedStyle]}
            />
          </View>
        ) : (
          <Text className="recent-viewed-card-note">You've watched all episodes</Text>
        )}
      </View>
    </Pressable>
  )
}
