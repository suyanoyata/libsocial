import { useState } from "react";
import { View, Text, Pressable } from "react-native";

export const TitleSummary = ({ children: summary }: { children: string }) => {
  const [lines, setLines] = useState(4);
  const [height, setHeight] = useState<number>(0);
  const lineHeight = 16;

  return (
    <View>
      <Text
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
        className="text-zinc-200 text-sm"
        numberOfLines={lines}
      >
        {summary}
      </Text>
      {lineHeight * 4 < height && (
        <Pressable onPress={() => setLines(lines == 4 ? Infinity : 4)}>
          <Text className="text-purple-300 text-sm">
            {lines == 4 ? "Show more..." : "Less"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
