import { Icon as _Icon } from "@/components/icon"
import { Lottie } from "@/components/ui/lottie"
import { cn } from "@/lib/utils"
import { LucideProps } from "lucide-react-native"
import { useEffect } from "react"
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

interface IndicatorProps extends LucideProps {
  lottie?: boolean
}

export const ActivityIndicator = ({
  lottie,
  className,
  ...props
}: IndicatorProps) => {
  const rotation = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    }
  }, [rotation.value])

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      200
    )
    return () => cancelAnimation(rotation)
  }, [])

  const Icon = Animated.createAnimatedComponent(_Icon)

  if (lottie) {
    return (
      <Lottie
        className={cn("size-24", className)}
        source={require("@/assets/lottie/search-emoji.json")}
      />
    )
  }

  return (
    // @ts-ignore
    <Icon
      {...props}
      name="Loader"
      style={[animatedStyles]}
      className={cn("text-muted", className)}
      strokeWidth={2.6}
    />
  )
}
