import { TitleColors } from "@/hooks/useStore";
import i18n from "@/lib/intl";
import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Summary({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: TitleColors;
}) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const [open, setOpen] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);

  const lineHeight = 20;

  if (!children) return;

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: 8,
      }}
    >
      <Text
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
        style={{
          position: "absolute",
          opacity: 0,
        }}
      >
        {children}
      </Text>
      <Text
        style={{
          color: "white",
          lineHeight,
        }}
        numberOfLines={!open ? 4 : 2147483647}
      >
        {children}
      </Text>
      {lineHeight * 4 < height && (
        <AnimatedPressable
          style={{ width: 120 }}
          onPress={() => {
            setOpen((prev) => !prev);
          }}
        >
          <Text style={{ color: accent.showMore, marginTop: 2 }}>
            {open
              ? i18n.t("content.description.show_less")
              : i18n.t("content.description.show_more")}
          </Text>
        </AnimatedPressable>
      )}
    </View>
  );
}
