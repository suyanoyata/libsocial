import { TitleColors } from "@/hooks/useStore";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Summary({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: TitleColors;
}) {
  const [open, setOpen] = useState<boolean>(false);

  if (!children) return;

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: 8,
      }}
    >
      <Text
        style={{
          color: "white",
          lineHeight: 20,
        }}
        numberOfLines={!open ? 4 : 2147483647}
      >
        {children}
      </Text>
      <Pressable
        onPress={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Text style={{ color: accent.showMore, marginTop: 2 }}>
          {open ? "Показать меньше" : "Подробнее..."}
        </Text>
      </Pressable>
    </View>
  );
}
