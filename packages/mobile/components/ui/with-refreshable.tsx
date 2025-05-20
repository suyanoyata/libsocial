import { Lottie } from "@/components/ui/lottie"
import { View } from "react-native"
import { forwardRef, memo, useEffect } from "react"
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { cn } from "@/lib/utils"

type RefreshControlProps = {
  isRefreshing: boolean
  onRefresh: () => void
  refreshControlClassName?: string
  children?: React.ReactNode
}

export function withRefreshable<T extends React.ComponentType<any>>(
  WrappedComponent: T
) {
  const AnimatedComponent = Animated.createAnimatedComponent(WrappedComponent)

  const ComponentWithRefresh = forwardRef<
    any,
    React.ComponentProps<T> & RefreshControlProps
  >(
    (
      { isRefreshing, onRefresh, children, refreshControlClassName, ...rest },
      ref
    ) => {
      const pos = useSharedValue(0)
      const refreshing = useSharedValue(0)
      const didCallRefresh = useSharedValue(false)

      const animatedRef = useAnimatedRef<any>()

      const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
          pos.value = event.contentOffset.y
        },
        onEndDrag: (event) => {
          if (
            event.contentOffset.y < -100 &&
            !refreshing.value &&
            !didCallRefresh.value
          ) {
            refreshing.value = 1
            didCallRefresh.value = true
            runOnJS(onRefresh)()
          }
        },
      })

      useEffect(() => {
        if (!isRefreshing) {
          refreshing.value = withTiming(0, { duration: 300 }, () => {
            didCallRefresh.value = false
          })

          scrollTo(animatedRef, 0, 0, true)
        } else {
          refreshing.value = withTiming(1, { duration: 300 })
        }
      }, [isRefreshing])

      const refreshIconStyles = useAnimatedStyle(() => {
        const overscroll = -pos.value
        const progress = interpolate(
          overscroll,
          [0, 100],
          [0, 1],
          Extrapolation.CLAMP
        )
        return {
          opacity: progress,
          transform: [{ scale: progress }],
        }
      })

      const animatedProps = useAnimatedProps(() => {
        const topInset = interpolate(
          refreshing.value,
          [0, 1],
          [0, 100],
          Extrapolation.CLAMP
        )

        return {
          contentInset: { top: topInset },
        }
      })

      return (
        <View className="flex-1">
          <Animated.View
            className={cn(
              "absolute top-8 left-0 right-0 items-center",
              refreshControlClassName
            )}
            style={refreshIconStyles}
          >
            <Lottie
              className="size-14"
              source={require("@/assets/lottie/duck.json")}
            />
          </Animated.View>
          <AnimatedComponent
            // @ts-ignore
            ref={(node: InstanceType<T> | null) => {
              if (typeof ref === "function") ref(node)
              else if (ref) ref.current = node
              animatedRef.current = node
            }}
            {...(rest as React.ComponentProps<T>)}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            animatedProps={animatedProps}
          >
            {children}
          </AnimatedComponent>
        </View>
      )
    }
  )

  return memo(ComponentWithRefresh)
}
