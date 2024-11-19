import { useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

export const BackButton = ({ posterVisible }: { posterVisible: boolean }) => {
  const router: any = useNavigation();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!posterVisible) {
      opacity.value = withTiming(1, {
        duration: 200,
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 200,
      });
    }
  }, [posterVisible]);

  return (
    <Animated.View
      style={{
        zIndex: 99,
        flex: 1,
        top: 0,
        left: 0,
        position: "absolute",
        width: "100%",
      }}
    >
      <Animated.View
        style={{
          opacity: opacity,
          height: 56,
          backgroundColor: "black",
          width: "100%",
          position: "absolute",
        }}
      />
      <Pressable
        style={{
          margin: 12,
          marginTop: 16,
        }}
        onPress={() => router.goBack()}
      >
        <ChevronLeft size={28} color="white" strokeWidth={2.7} />
      </Pressable>
    </Animated.View>
  );
};
