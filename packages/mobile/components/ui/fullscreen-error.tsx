import Animated, { FadeIn } from "react-native-reanimated"

import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { BackButton } from "@/components/ui/back-button"

import { Lottie } from "@/components/ui/lottie"
import { LottieViewProps } from "lottie-react-native"

import { cn } from "@/lib/utils"

interface FullscreenErrorProps extends Omit<LottieViewProps, "source"> {
  className?: string
  iconClassName?: string
  children?: React.ReactNode | string
  fadeIn?: boolean
  shouldDisplayBack?: boolean
}

export const FullscreenError = ({
  fadeIn,
  className,
  iconClassName,
  children = "This content is not available",
  shouldDisplayBack = true,
  ...props
}: FullscreenErrorProps) => {
  const asChild = typeof children !== "string"

  const Comp = fadeIn ? Animated.View : View

  return (
    <Comp
      entering={fadeIn ? FadeIn : undefined}
      className={cn("items-center justify-center flex-1", className)}
    >
      {shouldDisplayBack && <BackButton />}
      <Lottie
        source={require("@/assets/emojis/sick-emoji.json")}
        className={cn("size-24", iconClassName)}
        autoPlay
        loop
        {...props}
      />
      {asChild ? (
        children
      ) : (
        <Text className="text-secondary text-base font-medium mt-2">
          {children}
        </Text>
      )}
    </Comp>
  )
}
