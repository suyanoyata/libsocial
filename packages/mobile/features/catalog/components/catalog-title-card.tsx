import type { CatalogItem } from "api/router/catalogRouter"
import { router } from "expo-router"

import { memo } from "react"
import { Pressable } from "react-native"
import { TransitionedImage } from "@/features/shared/components/transitioned-image"
import { Text } from "@/components/ui/text"

import { withImpact } from "@/lib/utils"

export const CatalogTitleCard = memo(
  ({ title }: { title: CatalogItem }) => {
    return (
      <Pressable
        onPress={() => {
          withImpact(() =>
            router.navigate({
              pathname: "/title-info",
              params: {
                slug_url: title.slug_url,
                site: title.site
              }
            })
          )
        }}
        className="my-2.5 w-[120px]"
      >
        <TransitionedImage
          source={{ uri: title.cover.thumbnail }}
          height={180}
          width={120}
          recycleId={title.id}
        />
        <Text className="text-sm font-medium text-primary mt-1" numberOfLines={2}>
          {title.eng_name != "" ? title.eng_name : title.name}
        </Text>
      </Pressable>
    )
  },
  (prev, next) => prev.title.id === next.title.id
)
