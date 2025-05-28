import { View } from "react-native"

import { BackButton } from "@/components/ui/back-button"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

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
  return (
    <View
      className={cn(
        "relative items-center justify-center flex-row mx-3 my-2",
        props.className
      )}
    >
      {props.showBackButton && (
        <View className="absolute top-0 -left-2">
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
        <View className="absolute right-3 top-0">{props.headerRight}</View>
      )}
    </View>
  )
}
