import { View } from "react-native"

import { useRoute } from "@react-navigation/native"

import { TitleChapters } from "@/features/title/ui/title-chapters"
import { TitleEpisodes } from "@/features/title/ui/title-episodes"
import { useDeferredRender } from "@/hooks/use-deferred-render"

export default function Chapter() {
  const route = useRoute()
  const { slug_url, site } = route.params as { slug_url: string; site: string }

  const enabled = useDeferredRender()

  if (!enabled) return null

  return (
    <View className="mx-2 mt-2 flex-1">
      {site !== "5" ? (
        <TitleChapters slug_url={slug_url} />
      ) : (
        <TitleEpisodes slug_url={slug_url} />
      )}
    </View>
  )
}
