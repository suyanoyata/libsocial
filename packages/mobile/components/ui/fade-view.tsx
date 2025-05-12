import { ViewProps } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

type FadeViewProps = ViewProps & {
  children?: React.ReactNode
  withEnter?: boolean
  withExit?: boolean
}

export const FadeView = ({
  children,
  withEnter = false,
  withExit = false,
  ...props
}: FadeViewProps) => {
  return (
    <Animated.View
      entering={withEnter ? FadeIn : undefined}
      exiting={withExit ? FadeOut : undefined}
      {...props}
    >
      {children}
    </Animated.View>
  )
}
