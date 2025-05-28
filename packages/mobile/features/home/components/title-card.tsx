import type { PopularTitle } from "api/router/titleRouter"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import { Link } from "expo-router"

import { View } from "react-native"

import { TransitionedImage } from "@/features/shared/components/transitioned-image"
import { Text } from "@/components/ui/text"

export const TitleCard = ({ title }: { title: Omit<PopularTitle, "genres"> }) => {
  return (
    <Link
      href={{
        pathname: "/title-info",
        params: {
          slug_url: title.slug_url,
          site: title.site
        }
      }}
      onPress={() => impactAsync(ImpactFeedbackStyle.Soft)}
      className="w-[120px]"
    >
      <View>
        <TransitionedImage
          source={{ uri: title.cover.thumbnail }}
          width={115}
          height={180}
        />
        <Text className="text-sm mt-1 font-medium text-secondary" numberOfLines={2}>
          {title.eng_name != "" ? title.eng_name : title.name}
        </Text>
      </View>
    </Link>
  )
}
