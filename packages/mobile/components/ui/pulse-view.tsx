import { usePulseValue } from "@/hooks/use-pulse-value"
import { ViewProps } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

type PulseViewProps = ViewProps & {
  children?: React.ReactNode
  exiting?: typeof FadeOut
  entering?: typeof FadeIn
}

export const PulseView = ({
  children,
  exiting,
  entering,
  ...props
}: PulseViewProps) => {
  const opacity = usePulseValue()
  return (
    <Animated.View
      exiting={exiting}
      entering={entering}
      {...props}
      style={{ opacity }}
    >
      {children}
    </Animated.View>
  )
}
