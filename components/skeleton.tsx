import { ViewStyle } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const Skeleton = ({
  width,
  height,
  style,
}: {
  width?: number;
  height?: number;
  style?: ViewStyle;
}) => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        backgroundColor: "rgba(255,255,255,0.07)",
        width: width || "100%",
        height: height || 24,
        borderRadius: 6,
        ...style,
      }}
    />
  );
};
