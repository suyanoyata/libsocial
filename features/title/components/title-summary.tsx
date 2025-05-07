import { useState } from "react"
import { View, Pressable } from "react-native"

import { Text } from "@/components/ui/text"

export const TitleSummary = ({ children: summary }: { children: string }) => {
  const [lines, setLines] = useState(4)
  const [height, setHeight] = useState<number>(0)
  const lineHeight = 16

  return (
    <View>
      <Text
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
        className="text-secondary text-sm"
        numberOfLines={lines}
      >
        {summary}
      </Text>
      {lineHeight * 4 < height && (
        <Pressable onPress={() => setLines(lines == 4 ? 2000 : 4)} hitSlop={4}>
          <Text className="text-accent text-sm">
            {lines == 4 ? "Show more..." : "Less"}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
