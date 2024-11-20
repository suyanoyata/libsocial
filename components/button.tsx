import { PointerInteractionView } from "@thefunbots/react-native-pointer-interactions";
import { startTransition } from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

export const Button = ({
  children,
  style,
  onPress,
  icon,
  asChild = false,
  animationDisabled = false,
  iconPosition = "left",
}: {
  asChild?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  icon?: React.ReactNode;
  animationDisabled?: boolean;
  iconPosition?: "left" | "right";
}) => {
  const Component = Animated.createAnimatedComponent(Pressable);

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
          onPress && onPress();
        }}
        onPressOut={() => {
          startTransition(() => {
            scale.value = withTiming(1, {
              duration: 150,
            });
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
        onPress && onPress();
      }}
      onPressOut={() => {
        scale.value = withTiming(1, {
          duration: 150,
        });
      }}
      style={{
        transform: [{ scale: scale }],
        backgroundColor: "#5e35b1",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        ...style,
      }}
    >
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
    </Component>
  );
};
