import { usePulseValue } from "@/hooks/usePulseValue";
import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export const PlaceholderFlashingComponent = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
}) => {
  const opacity = usePulseValue();

  return (
    <Animated.View style={{ opacity, flex: 1, ...style }}>
      {children}
    </Animated.View>
  );
};
