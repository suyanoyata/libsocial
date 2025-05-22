import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import { View } from "react-native"

import { MotiView } from "moti"

export const TabIcon = ({
  icon,
  focused,
}: {
  icon: string
  focused: boolean
}) => {
  return (
    <View className="relative items-center justify-center">
      <Icon
        size={20}
        name={icon}
        strokeWidth={focused ? 0 : 2}
        fill={cn(focused && "text-violet-600 dark:text-violet-300")}
        className={cn(
          "z-10",
          focused
            ? "text-violet-600 dark:text-violet-300"
            : "dark:text-zinc-600 text-zinc-400"
        )}
      />
      <MotiView
        from={{ width: 40 }}
        animate={{ width: focused ? 65 : 40 }}
        transition={{
          type: "spring",
          clamp: {
            min: 1,
            max: 15,
          },
          stiffness: 200,
        }}
        className={cn(
          "absolute h-10",
          focused && "bg-violet-100 dark:bg-violet-400/50 rounded-full p-2"
        )}
      />
    </View>
  )
}
