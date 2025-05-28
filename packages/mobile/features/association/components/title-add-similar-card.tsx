import FastImage from "@d11/react-native-fast-image"

import type { QuickSearchItem } from "api/router/searchRouter"
import type { Title } from "api/router/titleRouter"
import { useMemo } from "react"
import { Pressable, useWindowDimensions, View } from "react-native"
import MenuView from "react-native-context-menu-view"
import { useCreateSimilar } from "@/features/association/lib/create-similar"
import { Genres } from "@/features/title/components/genres"
import { Icon } from "@/components/icon"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import i18n from "@/i18n"

const relationReasons = ["genres", "script"]

export const AssociationCard = ({
  data,
  title,
  disabled
}: {
  data: QuickSearchItem
  title: Title
  disabled?: boolean
}) => {
  const { width } = useWindowDimensions()

  const genres = useMemo(() => data.genres.slice(0, width / 140), [data.genres, width])

  const { mutate, isPending } = useCreateSimilar({
    slug_url: title.slug_url,
    data
  })

  if (disabled) return null

  return (
    <Pressable
      disabled={disabled}
      className="mb-2 mx-2 bg-muted overflow-hidden rounded-lg flex-row disabled:opacity-60 disabled:pointer-events-none"
    >
      <FastImage
        source={{ uri: data.cover.thumbnail }}
        style={{ width: 120, height: 160 }}
      />
      <View className="p-2 flex-1 relative">
        <Text className="text-primary font-medium text-base">
          {data.eng_name ?? data.name}
        </Text>
        <Text className="text-muted font-medium text-sm" numberOfLines={4}>
          {data.summary}
        </Text>
        <View className="mt-auto pointer-events-none">
          <Genres genres={genres} />
        </View>
        <MenuView
          style={{
            marginTop: "auto",
            position: "absolute",
            bottom: 4,
            right: 4
          }}
          onPress={(value) => {
            mutate({
              title: {
                slug_url: title.slug_url,
                type: title.model
              },
              similar: {
                slug_url: data.slug_url,
                type: data.model,
                reason: relationReasons[value.nativeEvent.index] as "genres"
              }
            })
          }}
          dropdownMenuMode
          disableShadow
          actions={relationReasons.map((relation) => ({
            // @ts-ignore
            title: i18n.t(`similar.${relation}`)
          }))}
        >
          <Button variant="tonal" size="sm" hitSlop={15}>
            {isPending ? (
              <ActivityIndicator size={18} />
            ) : (
              <Icon name="Plus" size={18} strokeWidth={2.7} variant="tonal" />
            )}
          </Button>
        </MenuView>
      </View>
    </Pressable>
  )
}
