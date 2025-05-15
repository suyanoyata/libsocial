import { View } from "react-native"
import { router } from "expo-router"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button } from "@/components/ui/button"
import { Genres } from "@/features/title/components/genres"
import { TitleSummary } from "@/features/title/components/title-summary"

import { TitleRelations } from "@/features/similar/ui/title-relations"
import { CreateBookmarkTrigger } from "@/features/bookmark/components/create-bookmark-trigger"

import type { Title } from "api/router/titleRouter"

import { Icon } from "@/components/icon"

export const TitleAbout = ({ data }: { data: Title }) => {
  const { bottom } = useSafeAreaInsets()

  const iconName = data.site == 5 ? "Play" : "Bookmark"
  const text = data.site == 5 ? "Start Watching" : "Start Reading"

  return (
    <View
      style={{
        paddingBottom: bottom + 8,
      }}
      className="mt-2"
    >
      <View className="flex-row w-full gap-2 mb-3">
        <Button
          disabled={data.isLicensed}
          onPress={() => {
            router.push({
              pathname: "/(modals)/title-contents",
              params: {
                slug_url: data.slug_url,
                site: data.site,
              },
            })
          }}
          className="disabled:opacity-70 flex-1"
          iconLeft={
            <Icon
              name={iconName}
              disabled={data.isLicensed}
              size={18}
              filled
              variant="accent"
            />
          }
          variant={data?.isLicensed ? "destructive" : "accent"}
        >
          {data?.isLicensed ? "Sorry, this content is licensed" : text}
        </Button>
        <CreateBookmarkTrigger slug_url={data.slug_url} site={data.site} />
      </View>
      <TitleSummary>{data.summary}</TitleSummary>
      <Genres genres={data.genres} />
      <TitleRelations
        label="Related"
        slug_url={data.slug_url}
        site={data.site}
      />
    </View>
  )
}
