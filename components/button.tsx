import { store } from "@/hooks/useStore";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Conditional } from "./misc/conditional";

export const Button = ({
  children,
  style,
  onPress,
  icon,
  isPending,
  asChild = false,
  animationDisabled = false,
  iconPosition = "left",
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  icon?: React.ReactNode;
  isPending?: boolean;
  asChild?: boolean;
  animationDisabled?: boolean;
  iconPosition?: "left" | "right";
}) => {
  const Component = Animated.createAnimatedComponent(Pressable);
  const { appTheme } = store();

  const scale = useSharedValue(1);

  if (animationDisabled) {
    return (
      <Pressable
        onPress={() => {
          onPress && onPress();
        }}
        style={{
          ...style,
        }}
      >
        {children}
      </Pressable>
    );
  }

  if (asChild) {
    return (
      <Component
        onPressIn={() => {
          scale.value = withTiming(0.95, {
            duration: 150,
          });
        }}
        onPress={() => {
          if (onPress) {
            onPress();
            scale.value = withTiming(1, {
              duration: 150,
            });
          }
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 150,
          });
        }}
        style={{
          transform: [{ scale: scale }],
          ...style,
        }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      onPressIn={() => {
        scale.value = withTiming(0.95, {
          duration: 150,
        });
      }}
      onPress={() => {
        if (onPress) {
          onPress();
          scale.value = withTiming(1, {
            duration: 150,
          });
        }
      }}
      onPressOut={() => {
        scale.value = withTiming(1, {
          duration: 150,
        });
      }}
      style={{
        transform: [{ scale: scale }],
        backgroundColor: appTheme.primary,
        paddingHorizontal: 12,
        paddingVertical: !!isPending ? 4 : 8,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        ...style,
      }}
    >
      <Conditional conditions={[!isPending]}>
        {iconPosition == "left" && icon}
        <Text
          style={{
            color: "white",
            fontWeight: "500",
          }}
        >
          {children}
        </Text>
        {iconPosition == "right" && icon}
      </Conditional>
      <Conditional conditions={[!!isPending]}>
        <ActivityIndicator size="small" color="white" />
      </Conditional>
    </Component>
  );
};
