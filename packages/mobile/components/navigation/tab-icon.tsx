import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import { useIsFocused } from "@react-navigation/native"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import { useEffect } from "react"
import { View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

export const TabIcon = ({
  icon,
  focused,
}: {
  icon: string
  focused: boolean
}) => {
  const isFocused = useIsFocused()

  const width = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }))

  useEffect(() => {
    if (isFocused) {
      width.value = withTiming(70, {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      })
      impactAsync(ImpactFeedbackStyle.Soft)
    } else {
      width.value = 50
    }
  }, [width, isFocused])

  return (
    <View className="relative items-center justify-center">
      <Icon
        size={20}
        name={icon}
        className={cn(
          "z-10",
          focused
            ? "text-violet-600 dark:text-violet-300"
            : "dark:text-zinc-600 text-zinc-400"
        )}
      />
      <Animated.View
        className={cn(
          "absolute h-10",
          focused && "bg-violet-100 dark:bg-violet-400/50 rounded-full p-2"
        )}
        style={[animatedStyle]}
      />
    </View>
  )
}
