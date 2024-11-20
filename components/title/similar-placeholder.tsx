import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const SimilarPlaceholder = () => {
  return (
    <Animated.View
      exiting={FadeOut}
      entering={FadeIn}
      style={{
        flexDirection: "row",
        height: 139,
        width: 360,
        backgroundColor: "rgba(255,255,255,0.07)",
        overflow: "hidden",
        borderRadius: 6,
        gap: 12,
      }}
    >
      <View
        style={{
          height: "100%",
          width: 100,
          borderRadius: 6,
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            maxHeight: 18,
            flex: 1,
            marginRight: 6,
            backgroundColor: "rgba(255,255,255,0.07)",
            borderRadius: 6,
            marginTop: 6,
          }}
        />
        <View
          style={{
            maxHeight: 24,
            flex: 1,
            marginRight: 6,
            backgroundColor: "rgba(255,255,255,0.07)",
            borderRadius: 6,
            marginTop: 12,
          }}
        />
        <View
          style={{
            marginTop: "auto",
            flex: 1,
            maxHeight: 12,
            borderRadius: 6,
            marginBottom: 12,
            marginRight: 6,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />
      </View>
    </Animated.View>
  );
};
