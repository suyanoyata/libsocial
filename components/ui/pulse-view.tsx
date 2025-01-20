import { usePulseValue } from "@/hooks/usePulseValue";
import { ViewProps } from "react-native";
import Animated from "react-native-reanimated";

type PulseViewProps = ViewProps & {
  children?: React.ReactNode;
};

export const PulseView = ({ children, ...props }: PulseViewProps) => {
  const opacity = usePulseValue();
  return (
    <Animated.View {...props} style={{ opacity }}>
      {children}
    </Animated.View>
  );
};
