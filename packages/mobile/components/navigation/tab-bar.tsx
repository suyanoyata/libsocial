import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import type {
  Descriptor,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native"
import { router } from "expo-router"
import { useMemo } from "react"
import { Pressable, View } from "react-native"

type BottomTabDescriptor = Descriptor<any, any, any>
type BottomTabDescriptorMap = Record<string, BottomTabDescriptor>

type BottomTabBarProps = {
  state: TabNavigationState<ParamListBase>
  descriptors: BottomTabDescriptorMap
}

export const TabBar = ({ state, descriptors }: BottomTabBarProps) => {
  const focusedIndex = useMemo(() => state.index, [state.index])

  return (
    <View
      className={cn(
        "flex-row w-full pb-safe justify-around pt-4 android:pb-safe-offset-2"
        // "bg-accent"
      )}
    >
      {state.routes.map((route, index) => (
        <Pressable
          hitSlop={17}
          key={route.key}
          onPress={() => {
            router.push(
              // @ts-ignore
              route.name == "index" ? `/(tabs)` : `/(tabs)/${route.name}`
            )
          }}
        >
          {descriptors[route.key].options.tabBarIcon({
            focused: focusedIndex === index,
            name: descriptors[route.key].options.icon,
          })}
          <Text
            className={cn(
              "mt-4 text-xs font-semibold text-muted w-full",
              focusedIndex === index && "text-accent"
            )}
          >
            {descriptors[route.key].options.title}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
