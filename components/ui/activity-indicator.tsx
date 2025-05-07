import { Loader } from "lucide-react-native"
import { useEffect } from "react"
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

export const ActivityIndicator = () => {
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
      200,
    )
    return () => cancelAnimation(rotation)
  }, [])

  const Icon = Animated.createAnimatedComponent(Loader)

  return (
    <Icon style={[animatedStyles]} className="text-muted" strokeWidth={2.6} />
  )
}
