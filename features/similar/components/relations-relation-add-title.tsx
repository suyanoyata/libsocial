import { Text } from "@/components/ui/text"
import { Button, textVariants } from "@/components/ui/button"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { Genres } from "@/features/title/components/genres"

import { Pressable, useWindowDimensions, View } from "react-native"
import MenuView from "react-native-context-menu-view"
import FastImage from "@d11/react-native-fast-image"

import i18n from "@/i18n"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

import { BaseTitle } from "@/features/shared/types/title"

import { useCreateRelation } from "@/features/similar/lib/create-relation"

const relationReasons = ["sequel", "prequel", "spinoff"]

export const RelationAddTitle = ({
  slug_url,
  data,
  disabled,
}: {
  slug_url: string
  data: BaseTitle
  disabled?: boolean
}) => {
  const client = useQueryClient()

  const [reason, setReason] = useState("")

  const { width } = useWindowDimensions()

  const genres = useMemo(
    () => data.genres.slice(0, width / 140),
    [data.genres, width]
  )

  const { mutate, isPending } = useCreateRelation({ slug_url, data })

  return (
    <Pressable
      disabled={disabled}
      className="mb-2 mx-2 bg-muted-darken overflow-hidden rounded-lg flex-row disabled:opacity-60 disabled:pointer-events-none"
    >
      <FastImage
        source={{ uri: data.cover.default }}
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
            right: 4,
          }}
          onPress={(value) => {
            mutate({
              reason: relationReasons[value.nativeEvent.index],
            })
          }}
          dropdownMenuMode
          disableShadow
          actions={relationReasons.map((relation) => ({
            // @ts-ignore
            title: i18n.t(`related.${relation}`),
          }))}
        >
          <Button variant="tonal" size="sm" hitSlop={15}>
            {isPending ? (
              <ActivityIndicator size={18} />
            ) : (
              <Icon
                name="Plus"
                className={cn(textVariants({ variant: "tonal" }))}
              />
            )}
          </Button>
        </MenuView>
      </View>
    </Pressable>
  )

  return (
    <Pressable
      className={
        "bg-violet-100/60 dark:bg-violet-950/30 rounded-lg flex-row overflow-hidden gap-2 disabled:opacity-60 disabled:pointer-events-none relative"
      }
    >
      <FastImage
        source={{ uri: data.cover.default }}
        style={{ width: 90, height: 140 }}
      />
      <View className="my-1 mb-3 flex-1">
        <Text className="text-secondary font-semibold text-xl">
          {data.eng_name ?? data.name}
        </Text>
        <Genres className="mt-auto" genres={genres} />
      </View>
    </Pressable>
  )
}
