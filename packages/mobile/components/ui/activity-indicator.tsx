import { Icon as _Icon } from "@/components/icon"
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

export const ActivityIndicator = ({ className, ...props }: LucideProps) => {
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
