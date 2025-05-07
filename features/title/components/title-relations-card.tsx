import { Text } from "@/components/ui/text"
import { RelationsData } from "@/features/title/types/title-relations-type"
import i18n from "@/i18n"
import FastImage from "@d11/react-native-fast-image"
import { router } from "expo-router"
import { Pressable, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

export const TitleRelationsCard = ({ item }: { item: RelationsData }) => {
  return (
    <Animated.View entering={FadeIn}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/title-info",
            params: {
              slug_url: item.relatedManga.slug_url,
              site: item.relatedManga.site,
            },
          })
        }
        className="w-[310px] h-[140px] bg-muted-darken rounded-lg flex-row overflow-hidden"
      >
        <FastImage
          source={{
            uri: item.relatedManga.cover.default,
          }}
          style={{
            width: 100,
            height: 140,
          }}
        />
        <View className="flex-1 ml-2 my-2">
          <Text className="text-sm dark:text-violet-300 text-violet-400 font-medium">
            {/* @ts-ignore */}
            {i18n.t(`related.${item.reason}`)}
          </Text>
          <Text
            className="text-secondary text-base font-semibold"
            numberOfLines={2}
          >
            {item.relatedManga.eng_name ?? item.relatedManga.name}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}
