import { Pressable, ViewStyle } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { store, TitleColors } from "@/hooks/useStore";

type Props = {
  children: string;
  selected: string;
  style?: ViewStyle;
  accent: TitleColors;
  setSelected: (selected: string) => void;
  inactive?: boolean;
};

export default function Tab(props: Props) {
  const animated = useSharedValue(10);
  const opacity = useSharedValue(0.8);
  const active = props.selected ? props.selected == props.children : false;

  useEffect(() => {
    if (active) {
      animated.value = 0;
    }
  }, []);

  useEffect(() => {
    if (active) {
      animated.value = withTiming(0);
      opacity.value = withTiming(1);
      return;
    } else {
      animated.value = withTiming(10);
      opacity.value = withTiming(0.5);
      return;
    }
  }, [props.selected]);

  return (
    <Pressable
      style={{
        flex: 1,
        alignItems: "center",
      }}
      onPress={() => {
        if (props.inactive) return;
        props.setSelected(props.children);
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={{
          paddingVertical: 12,
          // color: active ? "white" : "gray",
          color: "white",
          opacity: !props.inactive ? opacity : 0.2,
          fontWeight: "600",
        }}
      >
        {props.children}
      </Animated.Text>
      <Animated.View
        style={{
          alignSelf: "flex-end",
          width: "100%",
          height: 4,
          // transform: [{ translateY: active ? 0 : 10 }],
          transform: [{ translateY: animated }],
          backgroundColor: props.accent.tabSelector,
          borderTopEndRadius: 4,
          borderTopStartRadius: 4,
          zIndex: 1,
          ...props.style,
        }}
      />
    </Pressable>
  );
}
