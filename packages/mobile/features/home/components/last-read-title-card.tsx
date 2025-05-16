import FastImage from "@d11/react-native-fast-image"
import { router } from "expo-router"

import { useEffect, useMemo } from "react"
import { View, Pressable } from "react-native"

import { Text } from "@/components/ui/text"

import { LastReadItem, useReadingTracker } from "@/store/use-reading-tracker"

import { Icon } from "@/components/icon"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

export const LastReadTitleCard = ({ item }: { item: LastReadItem }) => {
  const { removeItem } = useReadingTracker()

  const allChaptersRead = useMemo(
    () => item.lastReadChapter === item.overallChapters,
    [item]
  )

  const progress = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, 100])}%`,
  }))

  useEffect(() => {
    const id = setTimeout(() => {
      progress.value = withSpring(item.lastReadChapter / item.overallChapters, {
        mass: 3,
        damping: 100,
        stiffness: 180,
      })
    }, 200)

    return () => {
      clearTimeout(id)
    }
  }, [item])

  if (item.hide) return null

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/title-info",
          params: {
            slug_url: item.slug_url,
            site: item.site,
            withDelay: allChaptersRead ? undefined : "1",
          },
        })
        if (!allChaptersRead) {
          router.push({
            pathname: "/manga-reader",
            params: {
              slug_url: item.slug_url,
              index: String(item.lastReadChapter - 1),
            },
          })
        }
      }}
      className="recent-viewed-card-bg"
    >
      <Pressable
        onPress={() => {
          removeItem(item.slug_url)
        }}
        hitSlop={8}
        className="absolute top-2 right-2 text-zinc-500 z-10"
      >
        <Icon name="X" className="text-zinc-400" strokeWidth={2.2} size={20} />
      </Pressable>
      <FastImage
        source={{ uri: item.cover.default }}
        style={{ width: 100, height: 140 }}
      />
      <View className="p-2 flex-1">
        <Text className="recent-viewed-card" numberOfLines={2}>
          {item.title}
        </Text>
        {!allChaptersRead ? (
          <View className="recent-viewed-card-progress-bg">
            <Animated.View
              className="recent-viewed-card-progress-bg-active"
              style={[animatedStyle]}
            />
          </View>
        ) : (
          <Text className="recent-viewed-card-note">
            You've read all chapters
          </Text>
        )}
      </View>
    </Pressable>
  )
}
