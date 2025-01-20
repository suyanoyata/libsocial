import { useState } from "react";
import { View, Text, Pressable } from "react-native";

export const TitleSummary = ({ children: summary }: { children: string }) => {
  const [lines, setLines] = useState(4);
  return (
    <View>
      <Text className="text-zinc-200 text-sm" numberOfLines={lines}>
        {summary}
      </Text>
      <Pressable onPress={() => setLines(lines == 4 ? Infinity : 4)}>
        <Text className="text-purple-300 text-sm">
          {lines == 4 ? "Show more..." : "Less"}
        </Text>
      </Pressable>
    </View>
  );
};
