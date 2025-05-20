import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Platform, View } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { BackButton } from "@/components/ui/back-button"

type Options = {
  showBackButton?: boolean
  route: {
    name: string
  }
  options: {
    title?: string
  }
  className?: string
  headerRight?: React.ReactNode
}

export const Header = (props: Options) => {
  const { top } = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingTop: Platform.select({ ios: 8, android: top - 8 }),
      }}
      className={cn(
        "relative items-center justify-center flex-row mx-3",
        props.className
      )}
    >
      {props.showBackButton && (
        <View
          style={{ paddingTop: Platform.select({ ios: 8, android: top - 8 }) }}
          className="absolute top-0 -left-2"
        >
          <BackButton
            iconClassName="text-secondary"
            textClassName="text-secondary font-semibold"
            position="static"
          />
        </View>
      )}
      <Text
        numberOfLines={1}
        className="font-bold text-secondary text-center text-lg line-clamp-1 max-w-[60%]"
      >
        {props.options.title ?? props.route.name}
      </Text>
      {props.headerRight && (
        <View
          style={{ paddingTop: Platform.select({ ios: 8, android: top - 8 }) }}
          className="absolute right-3"
        >
          {props.headerRight}
        </View>
      )}
    </View>
  )
}
