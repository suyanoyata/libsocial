import Animated, {
  FadeOut,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "react-native";
import { useEffect, useState } from "react";

export default function Preloader() {
  const move = useSharedValue(60);
  const opacity = useSharedValue(0);
  const [show, setShow] = useState(true);

  function animation() {
    setTimeout(() => {
      move.value = withTiming(0, {
        duration: 850,
      });
    }, 650);

    setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 750,
      });
    }, 650);

    setTimeout(() => {
      setShow(false);
    }, 1750);
  }

  useEffect(() => {
    animation();
  }, []);

  if (!show) return null;

  return (
    <Animated.View
      exiting={FadeOut}
      style={{
        backgroundColor: "black",
        zIndex: 999,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        flex: 1,
      }}
    >
      <Animated.View
        style={{
          opacity: opacity,
          transform: [{ translateY: move }],
        }}
      >
        <Text style={{ color: "white", fontWeight: "700", fontSize: 28 }}>
          libsocial
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
