import { router } from "expo-router"

import { Text } from "@/components/ui/text"

import { BaseTitle } from "@/features/shared/types/title"

import { TransitionedImage } from "@/features/shared/components/transitioned-image"
import { Pressable } from "react-native"
import { useProperties } from "@/store/use-properties"
import { memo } from "react"
import { withImpact } from "@/lib/utils"

export const CatalogTitleCard = memo(
  ({ title }: { title: BaseTitle }) => {
    const { catalogImageWidth } = useProperties()
    return (
      <Pressable
        onPress={() => {
          withImpact(() =>
            router.navigate({
              pathname: "/title-info",
              params: {
                slug_url: title.slug_url,
                site: title.site,
              },
            })
          )
        }}
        className="w-full my-1 p-2"
      >
        <TransitionedImage
          source={{ uri: title.cover.default }}
          height={(catalogImageWidth + 2) * 1.36}
          width={catalogImageWidth - 14}
          recycleId={title.id}
        />
        <Text
          className="text-sm font-medium text-primary mt-1"
          numberOfLines={2}
        >
          {title.eng_name != "" ? title.eng_name : title.name}
        </Text>
      </Pressable>
    )
  },
  (prev, next) => prev.title.id === next.title.id
)
