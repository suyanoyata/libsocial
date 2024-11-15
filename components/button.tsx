import { Pressable, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

export const Button = ({
  children,
  style,
  onPress,
  icon,
  iconPosition = "left",
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const scale = useSharedValue(1);

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.95, {
          duration: 150,
        });
      }}
      onPressOut={() => {
        onPress && onPress();
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
    </AnimatedPressable>
  );
};
