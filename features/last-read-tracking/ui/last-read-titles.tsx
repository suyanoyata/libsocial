import { ScrollView, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useLastReadTitles } from "@/features/last-read-tracking/hooks/useLastReadTitles";

import { LastReadTitleCard } from "@/features/last-read-tracking/components/last-read-card";

import i18n from "@/lib/intl";

export const LastReadTitles = () => {
  const { titles } = useLastReadTitles();

  if (titles.length == 0) return null;

  return (
    <Animated.View entering={FadeIn} style={{ marginHorizontal: 12 }}>
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        {i18n.t("content.continue_reading")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {titles.map((title, index) => (
          <LastReadTitleCard title={title} key={index} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};
