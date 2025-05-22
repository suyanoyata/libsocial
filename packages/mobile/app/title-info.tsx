import { useTitleInfo } from "@/features/title/api/use-title-info"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"

import { ImageBackground, Platform, ScrollView, View } from "react-native"
import FastImage from "@d11/react-native-fast-image"
import { BlurView } from "expo-blur"

import { FadeView } from "@/components/ui/fade-view"
import { Text } from "@/components/ui/text"

import { TitleAbout } from "@/features/title/ui/title-about"

import { titleInfoRouteSchema } from "@/features/title/types/title-info-route"
import { BackButton } from "@/components/ui/back-button"
import { ActivityIndicator } from "@/components/ui/activity-indicator"

import { FullscreenError } from "@/components/ui/fullscreen-error"

import { trpc } from "@/lib/trpc"
import { useQueryClient } from "@tanstack/react-query"

import { useProperties } from "@/store/use-properties"

export default function TitleInfo() {
  const client = useQueryClient()

  const router = useRoute()

  const [shouldRender, setShouldRender] = useState(false)

  const { slug_url, site, withDelay } = router.params as {
    slug_url: string
    site: string
    withDelay: string | undefined
  }

  const { error } = titleInfoRouteSchema.safeParse({ slug_url, site })

  const { top } = useSafeAreaInsets()

  const { data } = useTitleInfo(slug_url, site)

  const celluar = useProperties((state) => state.celluar)

  useEffect(() => {
    if (!withDelay && data) {
      setShouldRender(true)
    }

    if (withDelay && data) {
      setTimeout(() => {
        setShouldRender(true)
      }, 500)
    }
  }, [withDelay, data])

  useEffect(() => {
    if (celluar) return

    if (!data) return

    if (data.model == "manga") {
      client.prefetchQuery(trpc.chapters.list.queryOptions(data.slug_url))
    } else {
      client.prefetchQuery(trpc.episodes.list.queryOptions(data.slug_url))
    }
  }, [data])

  if (error) {
    return <FullscreenError />
  }

  if (!data) {
    return (
      <View className="items-center justify-center flex-1">
        <BackButton />
        <ActivityIndicator />
      </View>
    )
  }

  if (!shouldRender) return null

  return (
    <FadeView withEnter className="flex-1">
      <BackButton iconClassName="text-white" textClassName="text-white" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: data.background.url }}
          style={{
            height: 320,
            paddingTop: Platform.OS == "ios" ? top + 40 : 60,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <BlurView
            intensity={20}
            style={{
              width: "100%",
              height: 320,
              position: "absolute",
              zIndex: 1,
              top: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
          <View className="mx-auto flex-row z-10">
            <FastImage
              source={{ uri: data.cover.default }}
              style={{
                borderRadius: 8,
                height: 220,
                width: 140,
              }}
            />
          </View>
        </ImageBackground>
        <View className="mx-2 gap-0.5 mt-2 flex-1">
          <Text className="text-4xl text-secondary font-bold" numberOfLines={2}>
            {data.eng_name != "" ? data.eng_name : data.name}
          </Text>
          <TitleAbout data={data} />
        </View>
      </ScrollView>
    </FadeView>
  )
}
