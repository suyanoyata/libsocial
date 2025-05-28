import FastImage from "@d11/react-native-fast-image"

import type { TitleRelatedItem, TitleSimilarItem } from "api/router/titleRouter"
import { router } from "expo-router"
import { Pressable, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { Text } from "@/components/ui/text"

import i18n from "@/i18n"

export const TitleAssociationCard = ({
  type = "related",
  item
}: {
  type?: "related" | "similar"
  item: TitleRelatedItem | TitleSimilarItem
}) => {
  if (!item.media) return null

  return (
    <Animated.View entering={FadeIn}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/title-info",
            params: {
              slug_url: item.media!.slug_url,
              site: item.media!.site
            }
          })
        }
        className="w-[310px] h-[140px] bg-muted rounded-lg flex-row overflow-hidden"
      >
        <FastImage
          source={{
            uri: item.media.cover.thumbnail
          }}
          style={{
            width: 100,
            height: 140
          }}
        />
        <View className="flex-1 ml-2 my-2">
          <Text className="text-sm dark:text-violet-300 text-violet-400 font-medium">
            {/* @ts-ignore */}
            {i18n.t(`${type}.${item.reason}`)}
          </Text>
          <Text className="text-secondary text-base font-semibold" numberOfLines={2}>
            {item.media.eng_name ?? item.media.name}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}
