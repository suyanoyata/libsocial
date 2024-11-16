import { useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

export const usePulseValue = () => {
  const duration = 600;

  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeoutId = setInterval(() => {
      if (opacity.value == 0) {
        return (opacity.value = withTiming(1, {
          duration: duration,
        }));
      }
      if (opacity.value == 1) {
        return (opacity.value = withTiming(0.5, {
          duration: duration,
        }));
      }

      if (opacity.value == 0.5) {
        return (opacity.value = withTiming(1, {
          duration: duration,
        }));
      }
    }, duration);

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  return opacity;
};
